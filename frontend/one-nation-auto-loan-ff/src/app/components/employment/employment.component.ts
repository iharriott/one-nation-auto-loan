import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { Employment } from 'src/app/interfaces/employment';
import { EmploymentDetails } from 'src/app/interfaces/employmentDetails';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.css'],
})
export class EmploymentComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) public dialogData: string
  ) {}

  @Output() closeEmploymentButtonClicked = new EventEmitter<any>();
  employmentForm!: FormGroup;
  isDisabled = false;
  empStatus = CommonConstants.empStatus;
  empType = CommonConstants.empType;
  applicant = '';
  applicantPhone: string | undefined;
  applicantAddress: string | undefined;
  applicantEmail: string | undefined;
  private addEmploymentSubscription?: Subscription;

  ngOnInit(): void {
    this.employmentForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
      occupation: [''],
      otherIncome: [''],
      otherIncomeType: [''],
      frequency: [''],
      status: [''],
      employmentList: this.fb.array([]),
    });

    //debugger;
    if (!this.dataService.isEditModeEmployment()) {
      this.addEmployment();
    }

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

    if (this.dataService.isEditModeEmployment()) {
      if (this.dataService.currentEmployment != undefined) {
        const { employmentList, ...otherFormdata } =
          this.dataService.currentEmployment;
        this.employmentForm.patchValue(otherFormdata);
        if (employmentList?.length > 0) {
          this.setEmploymentDetails(employmentList);
        }
      }
    }
  }

  employmentFormGroup(): FormGroup {
    return this.fb.group({
      employmentStatus: [''],
      employmentType: [''],
      organizationName: [''],
      street: [''],
      city: [''],
      province: [''],
      country: [''],
      postalCode: [''],
      phone: [''],
      employmentYears: [''],
      employmentMonths: [''],
      grossIncome: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  addEmploymentDetailsFormGroup(
    employmentDetails: EmploymentDetails
  ): FormGroup {
    return this.fb.group({
      employmentStatus: employmentDetails.employmentStatus,
      employmentType: employmentDetails.employmentType,
      organizationName: employmentDetails.organizationName,
      street: employmentDetails.street,
      city: employmentDetails.city,
      province: employmentDetails.province,
      country: employmentDetails.country,
      postalCode: employmentDetails.postalCode,
      phone: employmentDetails.phone,
      employmentYears: employmentDetails.employmentYears,
      employmentMonths: employmentDetails.employmentMonths,
      grossIncome: employmentDetails.grossIncome,
      startDate: employmentDetails.startDate,
      endDate: employmentDetails.endDate,
    });
  }

  mytooltipText(desc: string, numb: number) {
    return `${desc}${numb}`;
  }

  addEmploymentDetail(employmentDetailsInput: EmploymentDetails): FormGroup {
    const employmentDetail = this.addEmploymentDetailsFormGroup(
      employmentDetailsInput
    );
    (<FormArray>this.employmentForm.get('employmentList')).push(
      employmentDetail
    );
    return employmentDetail;
  }

  setEmploymentDetails(employmentDetails: EmploymentDetails[]): void {
    employmentDetails.forEach((empDetail) => {
      const addedEmploymentDetail = this.addEmploymentDetail(empDetail);
    });
  }

  addEmployment(): void {
    const employment = this.employmentFormGroup();
    (<FormArray>this.employmentForm.get('employmentList')).push(employment);
  }

  removeEmployment(i: number): void {
    if (i !== 0) {
      (<FormArray>this.employmentForm.get('employmentList')).removeAt(i);
    }
  }

  getEmployment(): FormArray {
    const entities = this.employmentForm.get('employmentList') as FormArray;
    return this.employmentForm.get('employmentList') as FormArray;
  }

  isEmploymentExists(): number {
    return this.getEmployment().controls.length;
  }

  submit(): void {
    debugger;
    const currentEmployment = this.employmentForm.getRawValue();
    console.log(`CURRENT EMP ${JSON.stringify(currentEmployment)}`);
    const userId = this.dataService.getLoggedInUserId();
    const appId = this.dataService.getPrimaryApplicantId();
    if (currentEmployment != null && userId != null) {
      if (this.dataService.isEditModeEmployment()) {
        const { pk, sk } = currentEmployment;
        this.addEmploymentSubscription = this.apiService
          .updateEmployment(currentEmployment, userId, pk, sk)
          .subscribe((data) => {
            const message = 'Employment Updated Successfully';
            this.dataService.currentEmployment = data;
            this.dataService.isEditModeEmployment.set(true);
            console.log(JSON.stringify(this.dataService.currentEmployment));
            this.dataService.showSucess(message);
            this.close();
          });
      } else {
        const { pk, sk, gsI1PK, gsI1SK, documentType, ...data } =
          currentEmployment;
        this.addEmploymentSubscription = this.apiService
          .createEmployment(currentEmployment, userId, appId)
          .subscribe((data) => {
            const message = 'Employment Created Successfully';
            this.dataService.currentEmployment = data;
            this.dataService.isEditModeEmployment.set(true);
            this.dataService.showSucess(message);
            console.log(JSON.stringify(this.dataService.currentEmployment));
            this.close();
          });
      }
    }
  }

  close(): void {
    this.closeEmploymentButtonClicked.emit('employment');
  }

  clear() {
    this.employmentForm.reset();
  }

  ngOnDestroy(): void {
    this.addEmploymentSubscription?.unsubscribe();
  }
}
