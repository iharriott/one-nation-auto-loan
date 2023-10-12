import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonConstants } from 'src/app/constants/common-constants';
import { DataService } from 'src/app/services/data.service';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import {
  MatDialogRef,
  MatDialog,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { ApplicantTypeSelectionPopupComponent } from '../applicant-type-selection-popup/applicant-type-selection-popup.component';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.css'],
})
export class ApplicantComponent implements OnInit {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialog: MatDialog,
    private apiService: ApiService,
    @Inject(MAT_DIALOG_DATA) public dialogData: string
  ) {}

  @Output() closeApplicantButtonClicked = new EventEmitter<any>();
  applicantForm!: FormGroup;
  mstatuses = CommonConstants.maritalStatus;
  gender = CommonConstants.gender;
  status = CommonConstants.status;
  dealStatus = CommonConstants.dealStatus;
  dealers = CommonConstants.dealer;
  dropdownList: any[] = [];
  dropdownSettings: IDropdownSettings = {};
  applicantType = CommonConstants.applicant;
  dialogText: string =
    'Unable to create co-applicant. Please select a primary applicant first';
  isDisabled = false;
  applicant = '';

  ngOnInit(): void {
    this.applicantForm = this.fb.group({
      applicantType: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      sin: [''],
      dob: [''],
      maritalStatus: [],
      gender: [],
      creditScore: [],
      status: [],
      dealStatus: [],
      referralCode: [],
      tempDealerId: [],
      sales: [],
      finance: [],
      gross: [],
      address: this.fb.array([]),
    });

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'item',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 5,
      searchPlaceholderText: 'Search',
      allowSearchFilter: true,
      closeDropDownOnSelection: false,
    };

    if (this.dataService?.primaryApplicant !== null) {
      this.applicant = `${this.dataService.primaryApplicant?.firstName} ${this.dataService.primaryApplicant?.lastName}`;
    }
    this.dropdownList = this.dealers;
  }

  addressFormGroup(): FormGroup {
    return this.fb.group({
      street: [''],
      city: [''],
      province: [''],
      country: [''],
      postalCode: [''],
      residenceYears: [''],
      residenceMonths: [''],
    });
  }

  addAddress(): void {
    const address = this.addressFormGroup();
    (<FormArray>this.applicantForm.get('address')).push(address);
  }

  removeAddress(i: number): void {
    (<FormArray>this.applicantForm.get('address')).removeAt(i);
  }

  getAddress(): FormArray {
    const entities = this.applicantForm.get('address') as FormArray;
    return this.applicantForm.get('address') as FormArray;
  }

  isAddressExists(): number {
    return this.getAddress().controls.length;
  }

  submit(): void {
    const currentApplicant = this.applicantForm.getRawValue();
    const userId = this.dataService.user?.sk;
    if (currentApplicant != null && userId != null) {
      this.apiService
        .createApplicant(currentApplicant, userId!)
        .subscribe((data) => {
          this.dataService.primaryApplicant = data;
          this.dataService.isapplicantExists = true;
          this.dataService.applicantName = `${this.dataService?.primaryApplicant.firstName} ${this.dataService?.primaryApplicant.lastName}`;
          this.dialogData = `Applicant Created Successfully`;
          this.dataService.applicantExist$.next(true);
          this.dataService.openSackBar(this.dialogData, 'ok');
          this.close();
          //this.openDialog();
          console.log(JSON.stringify(this.dataService.primaryApplicant));
          console.log(`userid = ${userId}`);
        });
    }
  }

  close(): void {
    this.closeApplicantButtonClicked.emit('applicant');
  }

  onSelectEvent(event: any) {
    console.log(event);
    console.log(this.dataService.primaryApplicant);
    if (event == 'Primary') {
      this.isDisabled = false;
    }
    this.applicantNotification(event, this.dataService.primaryApplicant);
  }

  applicantNotification(apptype: string, applicant: any) {
    if (apptype == 'Co-Applicant' && applicant == null) {
      this.dialogData = this.dialogText;
      this.isDisabled = true;
      this.openDialog();
    } else if (apptype == 'Co-Applicant' && applicant != null) {
      this.dialogData = `Your are about to create a co-applicant for ${this.dataService.primaryApplicant?.firstName} ${this.dataService.primaryApplicant?.lastName}`;
      this.openDialog();
    }
  }

  openDialog(): any {
    return this.dialog.open(ApplicantTypeSelectionPopupComponent, {
      width: '30%',
      height: '20%',
      autoFocus: false,
      data: this.dialogData,
    });
  }

  clear() {
    this.applicantForm.reset();
  }
}
