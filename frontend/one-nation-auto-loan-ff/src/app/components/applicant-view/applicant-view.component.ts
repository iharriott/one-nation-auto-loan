import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription } from 'rxjs';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-applicant-view',
  templateUrl: './applicant-view.component.html',
  styleUrls: ['./applicant-view.component.css'],
})
export class ApplicantViewComponent implements OnInit, OnDestroy {
  applicant = '';
  applicantPhone: string | undefined;
  applicantAddress: string | undefined;
  applicantEmail: string | undefined;
  address!: any[];
  notes!: any[];
  otherFormData: any;
  mortgage: any;
  employmentList!: any[];
  employmentOtherData: any;
  private applicantSubscription?: Subscription;
  private noteSubscription?: Subscription;
  private employmentSubscription?: Subscription;
  private mortgageSubscription?: Subscription;
  @Output() closeViewButtonClicked = new EventEmitter<any>();
  private viewApplicantSubscription?: Subscription;

  constructor(public dataService: DataService) {}

  ngOnInit(): void {
    // debugger;
    this.dataService.getApplicantData();

    this.applicantSubscription = this.dataService.currentApplicant$.subscribe({
      next: (data) => {
        if (data !== undefined) {
          // console.log(`view applicant ${JSON.stringify(data)}`);
          //this.formData = data;
          const { address, ...otherFormdata } = data;
          const { firstName, lastName, phone, email } = otherFormdata;
          this.applicant = `${firstName} ${lastName}`;
          this.applicantPhone = phone;
          this.applicantEmail = email;
          this.address = address;
          this.otherFormData = otherFormdata;

          //this.applicantForm.patchValue(otherFormdata);
          if (address?.length > 0) {
            const { street, city, province, postalCode, country } = address[0];
            this.applicantAddress = `${street} ${city} ${province} ${postalCode} ${country}`;
            //this.setAddresses(address);
          }
          //this.setTemplate('applicantview');
        }
      },
      error: console.log,
    });

    this.noteSubscription = this.dataService.currentNote$.subscribe({
      next: (data) => {
        const { notes, ...otherFormdata } = data;
        this.notes = notes;
        // console.log(`${JSON.stringify(this.notes)}`);
      },
      error: console.log,
    });

    this.mortgageSubscription = this.dataService.currentMortgage$.subscribe({
      next: (data) => {
        this.mortgage = data;
      },
      error: console.log,
    });

    this.employmentSubscription = this.dataService.currentEmployment$.subscribe(
      {
        next: (data) => {
          const { employmentList, ...otherFormdata } = data;
          this.employmentOtherData = otherFormdata;
          this.employmentList = employmentList;
        },
      }
    );

    // if (this.dataService?.currentApplicant !== null) {

    //   const fullName = `${this.dataService.currentApplicant?.firstName} ${this.dataService.currentApplicant?.lastName}`;
    //   this.applicant = fullName;
    //   this.applicantPhone = this.dataService.currentApplicant?.phone;
    //   this.applicantEmail = this.dataService.currentApplicant?.email;
    //   this.applicantAddress = `${this.dataService.currentApplicant?.address[0].street}
    //    ${this.dataService.currentApplicant?.address[0].city}
    //    ${this.dataService.currentApplicant?.address[0].province}
    //    ${this.dataService.currentApplicant?.address[0].postalCode} ${this.dataService.currentApplicant?.address[0].country}`;
    // }
  }
  close() {
    this.closeViewButtonClicked.emit('view');
  }

  ngOnDestroy(): void {
    this.noteSubscription?.unsubscribe();
    this.applicantSubscription?.unsubscribe();
    this.mortgageSubscription?.unsubscribe();
  }
}
