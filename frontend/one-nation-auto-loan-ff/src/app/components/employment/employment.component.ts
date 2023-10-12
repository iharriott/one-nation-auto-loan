import { Component, EventEmitter, Inject, OnInit, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { CommonConstants } from 'src/app/constants/common-constants';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-employment',
  templateUrl: './employment.component.html',
  styleUrls: ['./employment.component.css'],
})
export class EmploymentComponent implements OnInit {
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

  ngOnInit(): void {
    this.employmentForm = this.fb.group({
      occupation: [''],
      otherIncome: [''],
      otherIncomeType: [''],
      frequency: [''],
      status: [''],
      employment: this.fb.array([]),
    });
    this.applicant = `${this.dataService.primaryApplicant?.firstName} ${this.dataService.primaryApplicant?.lastName}`;
  }

  employmentFormGroup(): FormGroup {
    return this.fb.group({
      empStatus: [''],
      empType: [''],
      organizationName: [''],
      street: [''],
      city: [''],
      province: [''],
      country: [''],
      postalCode: [''],
      phone: [''],
      empYears: [''],
      empMonths: [''],
      grossIncome: [''],
      startDate: [''],
      endDate: [''],
    });
  }

  addEmployment(): void {
    const employment = this.employmentFormGroup();
    (<FormArray>this.employmentForm.get('employment')).push(employment);
  }

  removeEmployment(i: number): void {
    (<FormArray>this.employmentForm.get('employment')).removeAt(i);
  }

  getEmployment(): FormArray {
    const entities = this.employmentForm.get('employment') as FormArray;
    return this.employmentForm.get('employment') as FormArray;
  }

  isEmploymentExists(): number {
    return this.getEmployment().controls.length;
  }

  submit(): void {
    const currentEmployment = this.employmentForm.getRawValue();
    const user = this.dataService.user;
    this.apiService
      .createEmployment(currentEmployment, user!)
      .subscribe((data) => {
        this.dataService.currentEmployment = data;
        console.log(JSON.stringify(this.dataService.currentEmployment));
      });
  }

  close(): void {
    this.closeEmploymentButtonClicked.emit('employment');
  }

  clear() {
    this.employmentForm.reset();
  }
}
