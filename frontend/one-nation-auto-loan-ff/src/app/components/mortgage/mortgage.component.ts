import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-mortgage',
  templateUrl: './mortgage.component.html',
  styleUrls: ['./mortgage.component.css'],
})
export class MortgageComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService
  ) {}

  @Output() closeMortgageButtonClicked = new EventEmitter<any>();
  mortgageForm!: FormGroup;
  mortgageType = CommonConstants.mortgageType;
  mortgageStatus = CommonConstants.mortgageStatus;
  mortgageHolder = CommonConstants.mortgageHolder;
  applicant = '';
  applicantPhone: string | undefined;
  applicantAddress: string | undefined;
  applicantEmail: string | undefined;
  private addMortgageSubscription?: Subscription;

  ngOnInit(): void {
    this.mortgageForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
      mortgageType: [''],
      mortgagePayment: [''],
      mortgageAmount: [''],
      mortgageHolder: [''],
      marketValue: [''],
      status: [''],
    });

    if (this.dataService?.primaryApplicant !== null) {
      const { fullName } = this.dataService.primaryApplicant;
      this.applicant = fullName;
      this.applicantPhone = this.dataService.currentApplicant?.phone;
      this.applicantEmail = this.dataService.currentApplicant?.email;
      this.applicantAddress = `${this.dataService.currentApplicant?.address[0].street} 
       ${this.dataService.currentApplicant?.address[0].city} 
       ${this.dataService.currentApplicant?.address[0].province} 
       ${this.dataService.currentApplicant?.address[0].postalCode} ${this.dataService.currentApplicant?.address[0].country}`;
    }

    if (this.dataService.isEditModeMortgage()) {
      if (this.dataService.currentMortgage != undefined) {
        this.mortgageForm.patchValue(this.dataService.currentMortgage);
      }
    }
  }

  submit() {
    debugger;
    const currentMortgage = this.mortgageForm.getRawValue();
    const appId = this.dataService.getPrimaryApplicantId();
    const userId = this.dataService.getLoggedInUserId();

    if (currentMortgage != null && userId != null) {
      const { pk, sk } = currentMortgage;
      if (this.dataService.isEditModeMortgage()) {
        this.addMortgageSubscription = this.apiService
          .updateMortgage(currentMortgage, userId, pk, sk)
          .subscribe((data) => {
            this.dataService.currentMortgage = data;
            this.dataService.isEditModeMortgage.set(true);
            console.log(JSON.stringify(this.dataService.currentNote));
            this.close();
          });
      } else {
        const { pk, sk, gsI1PK, gsI1SK, documentType, ...data } =
          currentMortgage;
        this.addMortgageSubscription = this.apiService
          .createMortgage(data, userId, appId)
          .subscribe((data) => {
            this.dataService.currentMortgage = data;
            this.dataService.isEditModeMortgage.set(true);
            console.log(JSON.stringify(this.dataService.currentNote));
            this.close();
          });
      }
    }
  }

  clear() {
    this.mortgageForm.reset();
  }

  close() {
    this.closeMortgageButtonClicked.emit('mortgage');
  }

  ngOnDestroy(): void {
    this.addMortgageSubscription?.unsubscribe();
  }
}
