import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
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
import { User } from 'src/app/interfaces/user';
import { Address } from 'src/app/interfaces/applicant';
import { catchError, forkJoin, Observable, of, Subscription } from 'rxjs';

@Component({
  selector: 'app-applicant',
  templateUrl: './applicant.component.html',
  styleUrls: ['./applicant.component.css'],
})
export class ApplicantComponent implements OnInit, OnDestroy {
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
  formData: any;
  isEditMode!: boolean;
  private addApplicantSubscription?: Subscription;

  ngOnInit(): void {
    this.applicantForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
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
    //debugger;
    if (this.dataService?.primaryApplicant !== null) {
      const { fullName } = this.dataService.primaryApplicant;
      this.applicant = fullName;
    } else {
      this.dataService.applicantExist$.next(false);
    }
    //debugger;
    this.dropdownList = this.dealers;
    this.dataService.editMode$.subscribe({
      next: (data) => (this.isEditMode = data),
      error: console.log,
    });
    if (this.isEditMode) {
      this.dataService.getApplicantData();
      // debugger;
      this.dataService.currentApplicant$.subscribe({
        next: (data) => {
          if (data !== undefined) {
            this.formData = data;
            const { address, ...otherFormdata } = data;
            this.applicantForm.patchValue(otherFormdata);
            if (address?.length > 0) {
              this.setAddresses(address);
            }
          }
        },
        error: console.log,
      });
    } else {
      this.addAddress();
    }
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

  addAddressFormGroup(address: Address): FormGroup {
    return this.fb.group({
      street: address.street,
      city: address.city,
      province: address.province,
      country: address.country,
      postalCode: address.postalCode,
      residenceYears: address.residenceYears,
      residenceMonths: address.residenceMonths,
    });
  }

  addAddresses(addressInput: Address): FormGroup {
    const address = this.addAddressFormGroup(addressInput);
    (<FormArray>this.applicantForm.get('address')).push(address);
    return address;
  }

  setAddresses(addresses: Address[]): void {
    addresses.forEach((address) => {
      const addedAddress = this.addAddresses(address);
    });
  }

  // getApplicantData() {
  //   const pk = this.dataService.applicantPk;
  //   const sk = this.dataService.applicantSk;
  //   if (pk.length > 0 && sk.length > 0) {
  //     forkJoin({
  //       url1: this.apiService
  //         .getApplicantById(sk, pk)
  //         .pipe(catchError((err) => of(err.status))),
  //       url2: this.apiService
  //         .getCurrentEmployment(sk)
  //         .pipe(catchError((err) => of(undefined))),
  //       url3: this.apiService
  //         .getCurrentNote(sk)
  //         .pipe(catchError((err) => of(undefined))),
  //       url4: this.apiService
  //         .getCurrentMortgage(sk)
  //         .pipe(catchError((err) => of(undefined))),
  //     }).subscribe({
  //       next: (data) => {
  //         this.formData = data.url1;
  //         const { address, ...otherFormdata } = data.url1;
  //         this.applicantForm.patchValue(otherFormdata);
  //         if (address?.length > 0) {
  //           this.setAddresses(address);
  //         }
  //         this.dataService.applicantExist$.next(true);
  //         this.dataService.editMode$.next(true);
  //         this.dataService.currentEmployment = data.url2;
  //         this.dataService.currentEmployment === undefined
  //           ? this.dataService.isEditModeEmployment.set(false)
  //           : this.dataService.isEditModeEmployment.set(true);
  //         console.log(
  //           `EMPLOYMENT ${JSON.stringify(this.dataService.currentEmployment)}`
  //         );
  //         (this.dataService.currentNote = data.url3),
  //           console.log(`NOTE ${JSON.stringify(this.dataService.currentNote)}`);
  //         this.dataService.currentNote === undefined
  //           ? this.dataService.isEditModeNote.set(false)
  //           : this.dataService.isEditModeNote.set(true);
  //         this.dataService.currentMortgage = data.url4;
  //         this.dataService.currentMortgage === undefined
  //           ? this.dataService.isEditModeMortgage.set(false)
  //           : this.dataService.isEditModeMortgage.set(true);
  //         console.log(
  //           `MORTGAGE ${JSON.stringify(this.dataService.currentMortgage)}`
  //         );
  //       },
  //       error: console.log,
  //     });
  //   }
  // }

  addAddress(): void {
    const address = this.addressFormGroup();
    (<FormArray>this.applicantForm.get('address')).push(address);
  }

  removeAddress(i: number): void {
    if (i !== 0) {
      (<FormArray>this.applicantForm.get('address')).removeAt(i);
    }
  }

  getAddress(): FormArray {
    //const entities = this.applicantForm.get('address') as FormArray;
    return this.applicantForm.get('address') as FormArray;
  }

  isAddressExists(): number {
    return this.getAddress().controls.length;
  }

  submit(): void {
    let currentApplicant = null;
    let user: User;
    let isEditmode = false;
    let userId = '';
    let orgId = '';

    user = this.dataService.getLoggedInUser();
    if (user != undefined) {
      userId = user?.sk;
      orgId = user?.pk;
    }

    this.dataService.editMode$.subscribe({
      next: (data) => {
        isEditmode = data;
      },
      error: console.log,
    });

    //debugger;

    console.log(`The user from local storage ${user!}`);
    if (isEditmode) {
      currentApplicant = this.applicantForm.getRawValue();
      console.log(JSON.stringify(currentApplicant));
    } else {
      const { pk, sk, gsI1PK, gsI1SK, ...data } =
        this.applicantForm.getRawValue();
      currentApplicant = data;
    }

    if (currentApplicant != null && userId != null) {
      if (!isEditmode) {
        const message = 'Applicant Created Successfully';
        this.addApplicantSubscription = this.apiService
          .createApplicant(currentApplicant, userId)
          .subscribe((data) => {
            this.processSumbit(data, message);
            this.dataService.getNewListData();
            this.close();
          });
      } else {
        const message = 'Applicant Updated Successfully';
        const { sk } = currentApplicant;
        this.addApplicantSubscription = this.apiService
          .updateApplicant(currentApplicant, userId, orgId, sk)
          .subscribe((data) => {
            this.processSumbit(data, message);
            this.dataService.getNewListData();
            this.close();
          });
      }
    }
  }

  close(): void {
    this.closeApplicantButtonClicked.emit('applicant');
  }

  processSumbit(data: any, message: string) {
    this.dataService.primaryApplicant = data;
    this.dataService.isapplicantExists = true;
    this.dataService.applicantName = `${this.dataService?.primaryApplicant.firstName} ${this.dataService?.primaryApplicant.lastName}`;
    this.dialogData = message;
    this.dataService.applicantExist$.next(true);
    this.dataService.openSackBar(this.dialogData, 'ok');
    this.dataService.getNewListData();
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

  onDropDownClose() {
    //debugger;
    const currentApplicant = this.applicantForm.getRawValue();
    const user = this.dataService.getLoggedInUser();
    this.dataService.updateAttribute(currentApplicant, user, 'ASSG');
    this.dataService.getNewListData();
  }

  dealStatusChanged() {
    debugger;
    const currentApplicant = this.applicantForm.getRawValue();
    const user = this.dataService.getLoggedInUser();
    this.dataService.updateAttribute(currentApplicant, user, 'COMP');
    this.dataService.getNewListData();
  }

  ngOnDestroy(): void {
    this.addApplicantSubscription?.unsubscribe();
  }
}
