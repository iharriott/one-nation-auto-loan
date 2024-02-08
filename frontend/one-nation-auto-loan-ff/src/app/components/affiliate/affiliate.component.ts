import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css'],
})
export class AffiliateComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  affiliateForm!: FormGroup;
  private addAffiliateSubscription?: Subscription;
  @Output() closeAffiliateButtonClicked = new EventEmitter<any>();

  ngOnInit(): void {
    this.createForm();
    if (this.dataService.isEditModeAffiliate()) {
      //this.dataService.getApplicantData();
      // debugger;
      this.addAffiliateSubscription =
        this.dataService.currentAffiliateLead$.subscribe({
          next: (data) => {
            if (data !== undefined) {
              //this.formData = data;
              //const { address, ...otherFormdata } = data;
              console.log(`affiliate data ${JSON.stringify(data)}`);
              this.affiliateForm.patchValue(data);
            }
          },
          error: console.log,
        });
    }
  }

  createForm() {
    this.affiliateForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      note: [''],
    });
  }

  close() {
    this.closeAffiliateButtonClicked.emit('affiliate');
  }

  clear() {
    this.affiliateForm.reset();
  }

  submit() {
    //debugger;
    console.log(this.affiliateForm.getRawValue());
    const currentAffiliateLead = this.affiliateForm.getRawValue();
    //const appId = this.dataService.getPrimaryApplicantId();
    const userId = this.dataService.getLoggedInUserId();
    if (currentAffiliateLead != null && userId != null) {
      if (this.dataService.isEditModeAffiliate()) {
        const { pk, sk } = currentAffiliateLead;
        this.addAffiliateSubscription = this.apiService
          .updateAffiliateLead(currentAffiliateLead, pk, sk, userId)
          .subscribe({
            next: (data) => {
              const message = 'Affiliate Lead updated Successfully';
              this.dataService.currentAffiliateLead$.next(data);
              this.dataService.isEditModeAffiliate.set(true);
              this.dataService.showSucess(message);
              //console.log(JSON.stringify(this.dataService.currentNote));
              this.dataService.getAffiliateLeads();
              this.close();
            },
            error: (error) => {
              const message = 'Affiliate Lead update Failed';
              this.dataService.showError(message);
            },
          });
      } else {
        const { pk, sk, gsI1PK, gsI1SK, ...data } = currentAffiliateLead;
        this.addAffiliateSubscription = this.apiService
          .createAffiliateLead(data, CommonConstants.organization, userId)
          .subscribe({
            next: (data) => {
              const message = 'Affiliate Lead created Successfully';
              this.dataService.currentAffiliateLead$.next(data);
              this.dataService.isEditModeAffiliate.set(true);
              this.dataService.showSucess(message);
              this.dataService.getAffiliateLeads();
              //console.log(JSON.stringify(this.dataService.currentNote));
              this.close();
            },
            error: (error) => {
              const message = 'Affiliate Lead create Failed';
              this.dataService.showError(message);
            },
          });
      }
    }
  }

  ngOnDestroy(): void {
    this.addAffiliateSubscription?.unsubscribe();
  }
}
