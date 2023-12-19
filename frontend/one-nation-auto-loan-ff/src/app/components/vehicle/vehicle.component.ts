import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ThemePalette } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ProgressBarMode } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { CommonConstants } from 'src/app/constants/common-constants';
import { VehicleDetail } from 'src/app/interfaces/vehicle';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-vehicle',
  templateUrl: './vehicle.component.html',
  styleUrls: ['./vehicle.component.css'],
})
export class VehicleComponent implements OnInit, OnDestroy {
  @Output() closeVehicleButtonClicked = new EventEmitter<any>();
  vehicleForm!: FormGroup;
  applicant = '';
  applicantPhone: string | undefined;
  applicantAddress: string | undefined;
  applicantEmail: string | undefined;
  vehicleType = CommonConstants.vehicleType;
  vehicleMake = CommonConstants.vehicleMake;
  vehicleModel = CommonConstants.vehicleModel;
  vehicleStatus = CommonConstants.vehicleStatus;
  vehicleBodyStyle = CommonConstants.vehicleBodyStyle;
  productImageUploaded: any;
  color: ThemePalette = 'primary';
  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;
  dialogRef: any;
  productImage: any;
  productImageArray: any[] = [];
  currentVehicleIndex = 0;
  imageObject: { [key: number]: string } = {};
  imageKey = 'image';
  currentImageKey: string = '';
  file!: File;
  url: string =
    'https://www.google.ca/url?sa=i&url=https%3A%2F%2Fdevinknightsql.com%2F2017%2F03%2F07%2Fpower-bi-custom-visuals-class-module-41-image-viewer%2F&psig=AOvVaw0qAOi0vNqXWxm0_i0-J1jf&ust=1702419943793000&source=images&cd=vfe&ved=0CBIQjRxqFwoTCOCJ7NK2iIMDFQAAAAAdAAAAABAE';
  private addvehicleSubscription?: Subscription;
  @ViewChild('content', { static: true })
  public fileUploadPopup!: TemplateRef<any>;
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private apiService: ApiService,
    private dialog: MatDialog //private modalService: MDBModalService
  ) {}

  ngOnInit(): void {
    this.vehicleForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
      vehicles: this.fb.array([]),
    });

    //set initial note
    if (!this.dataService.isEditModeVehicle()) {
      this.addVehicle();
    }

    if (this.dataService?.primaryApplicant !== null) {
      //debugger;
      const { fullName } = this.dataService.primaryApplicant;
      this.applicant = fullName;
      this.applicantPhone = this.dataService.currentApplicant?.phone;
      this.applicantEmail = this.dataService.currentApplicant?.email;
      this.applicantAddress = `${this.dataService.currentApplicant?.address[0].street} 
       ${this.dataService.currentApplicant?.address[0].city} 
       ${this.dataService.currentApplicant?.address[0].province} 
       ${this.dataService.currentApplicant?.address[0].postalCode} ${this.dataService.currentApplicant?.address[0].country}`;
    }

    debugger;
    if (this.dataService.isEditModeVehicle()) {
      if (this.dataService.currentVehicle != undefined) {
        const { vehicles, ...otherFormdata } = this.dataService.currentVehicle;
        this.vehicleForm.patchValue(otherFormdata);
        if (vehicles?.length > 0) {
          this.setVehicles(vehicles);
        }
      }
    }
  }

  ngOnDestroy(): void {}

  addVehicleFormGroup(vehicle: VehicleDetail): FormGroup {
    return this.fb.group({
      firstName: vehicle.firstName,
      lastName: vehicle.lastName,
      email: vehicle.email,
      phone: vehicle.phone,
      type: vehicle.type,
      make: vehicle.make,
      model: vehicle.model,
      locatedStatus: vehicle.locatedStatus,
      year: vehicle.year,
      price: vehicle.price,
      mileage: vehicle.mileage,
      bodyStyle: vehicle.bodyStyle,
      note: vehicle.note,
      imageUrl: vehicle.imageUrl,
    });
  }

  vehicleFormGroup(): FormGroup {
    return this.fb.group({
      firstName: [''],
      lastName: [''],
      email: [''],
      type: [''],
      phone: [''],
      make: [''],
      model: [''],
      year: [''],
      locatedStatus: [''],
      price: [''],
      mileage: [''],
      bodyStyle: [''],
      note: [''],
      imageUrl: [''],
    });
  }

  addVehicles(vehicleInput: VehicleDetail): FormGroup {
    const vehicle = this.addVehicleFormGroup(vehicleInput);
    (<FormArray>this.vehicleForm.get('vehicles')).push(vehicle);
    return vehicle;
  }

  setVehicles(vehicles: VehicleDetail[]): void {
    vehicles.forEach((vehicle) => {
      const addedVehicles = this.addVehicles(vehicle);
    });
  }

  addVehicle(): void {
    debugger;
    this.currentVehicleIndex = this.currentVehicleIndex + 1;
    const vehicle = this.vehicleFormGroup();
    (<FormArray>this.vehicleForm.get('vehicles')).push(vehicle);
  }

  removeVehicle(i: number): void {
    if (i !== 0) {
      this.currentVehicleIndex = this.currentVehicleIndex - 1;
      (<FormArray>this.vehicleForm.get('vehicles')).removeAt(i);
    }
  }

  getAllVehicle(): FormArray {
    return this.vehicleForm.get('vehicles') as FormArray;
  }

  isVehicleExists(): number {
    return this.getAllVehicle().controls.length;
  }

  clear() {}

  close() {
    this.closeVehicleButtonClicked.emit('vehicle');
  }

  submit() {
    //this.vehicleForm.controls['imageUrl'].setValue(this.url);
    console.log(this.vehicleForm.getRawValue());

    debugger;
    const currentVehicle = this.vehicleForm.getRawValue();
    const appId = this.dataService.getPrimaryApplicantId();
    const userId = this.dataService.getLoggedInUserId();
    if (currentVehicle != null && userId != null) {
      if (this.dataService.isEditModeVehicle()) {
        const { pk, sk } = currentVehicle;
        const message = 'Vehicle updated Successfully';
        this.addvehicleSubscription = this.apiService
          .updateVehicle(currentVehicle, userId, pk, sk)
          .subscribe({
            next: (data) => {
              this.dataService.currentVehicle = data;
              this.dataService.isEditModeVehicle.set(true);
              this.dataService.showSucess(message);
              console.log(JSON.stringify(this.dataService.currentVehicle));
              this.close();
            },
            error: (error) => {
              const message = 'Vehicle updated Failed';
              this.dataService.showError(message);
            },
          });
      } else {
        const { pk, sk, gsI1PK, gsI1SK, ...data } = currentVehicle;
        const message = 'Vehicle created Successfully';
        this.addvehicleSubscription = this.apiService
          .createVehicle(data, userId, appId)
          .subscribe({
            next: (data) => {
              this.dataService.currentVehicle = data;
              this.dataService.isEditModeNote.set(true);
              this.dataService.showSucess(message);
              console.log(JSON.stringify(this.dataService.currentVehicle));
              this.close();
            },
            error: (error) => {
              const message = 'Vehicle create Failed';
              this.dataService.showError(message);
            },
          });
      }
    }
  }

  onChange(event: any) {
    const fileType = event.target.files[0].type;
    this.file = event.target.files[0];
    if (fileType.match(/image\/*/)) {
      const reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]);
      reader.onload = (event: any) => {
        // console.log(`image url ${event.target.result}`);
        this.url = event.target.result;
        this.productImageArray = [...this.productImageArray, reader.result];
        console.log(`image array ${this.productImageArray}`);
        this.productImage = reader.result;
        // this.productImage =
        //   this.productImageArray[this.currentVehicleIndex - 1];
        console.log(`image  ${this.productImage}`);
        console.log(`vehicle index ${this.currentVehicleIndex}`);
      };
    } else {
      this.dataService.showError('Please select correct image format');
    }
  }

  proceedUpload() {
    debugger;
    const imageKey = this.imageKey + this.currentVehicleIndex;
    this.currentImageKey = imageKey;
    let formdata = new FormData();
    formdata.append('file', this.file, 'myfileName');
    this.imageObject[this.currentVehicleIndex] = this.productImage;
    //this.imageObject = { ...this.imageObject, };
    this.productImageUploaded = this.imageObject[this.currentVehicleIndex];
    // this.productImageUploaded =
    //   this.productImageArray[this.currentVehicleIndex - 1];
    this.closeFilePopup();
    //call service to uploadImage and pass fromdata as a parameter
    //refresh data
    //alert user upload completed
  }

  openFilePopup() {
    this.dialogRef = this.openDialog();
  }

  closeFilePopup() {
    this.dialogRef.close();
  }

  openDialog(): any {
    return this.dialog.open(this.fileUploadPopup, {
      width: '30%',
      height: '60%',
      autoFocus: false,
      //data: this.dialogData,
    });
  }
}
