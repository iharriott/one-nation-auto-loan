import {
  Component,
  EventEmitter,
  Inject,
  OnInit,
  Output,
  OnDestroy,
} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  private currentApplicantSubscription?: Subscription;

  ngOnInit(): void {
    this.applicantForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
      applicantType: [''],
      relatedApplicantId: [],
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
      display: [],
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
      this.currentApplicantSubscription =
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

  get assignedDealer(): FormControl {
    return this.applicantForm.get('tempDealerId') as FormControl;
  }

  addressFormGroup(): FormGroup {
    return this.fb.group({
      street: [''],
      city: [''],
      province: [''],
      country: [''],
      postalCode: [''],
      residenceYears: [0],
      residenceMonths: [0],
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

    // debugger;

    console.log(`The user from local storage ${user!}`);
    if (isEditmode) {
      currentApplicant = this.applicantForm.getRawValue();
      console.log(JSON.stringify(currentApplicant));
    } else {
      const { pk, sk, gsI1PK, gsI1SK, ...data } =
        this.applicantForm.getRawValue();
      currentApplicant = data;
      if (currentApplicant.applicantType == 'Co-Applicant') {
        currentApplicant = {
          ...data,
          relatedApplicantId: [this.dataService.currentApplicant?.sk],
          relatedTo: [
            `${this.dataService.currentApplicant?.firstName} ${this.dataService.currentApplicant?.lastName}`,
          ],
        };
      }
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
    this.dataService.isEditModeApplicant.set(false);
    this.dataService.isEditModeNote.set(false);
    this.dataService.isEditModeMortgage.set(false);
    this.dataService.isEditModeEmployment.set(false);
    this.dataService.isEditModeVehicle.set(false);
    this.dataService.applicantExist$.next(false);
    this.dataService.editMode$.next(false);
    // this.dataService.primaryApplicant = null;
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
      // console.log(
      //   `primary app in notification ${JSON.stringify(
      //     this.dataService.primaryApplicant
      //   )}`
      // );
      this.dialogData = `Your are about to create a co-applicant for ${this.dataService.primaryApplicant?.fullName}`;
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
    this.currentApplicantSubscription?.unsubscribe();
  }
}
