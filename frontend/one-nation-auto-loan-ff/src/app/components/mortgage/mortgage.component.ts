import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CommonConstants } from 'src/app/constants/common-constants';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-mortgage',
  templateUrl: './mortgage.component.html',
  styleUrls: ['./mortgage.component.css'],
})
export class MortgageComponent {
  constructor(private fb: FormBuilder, private dataService: DataService) {}

  @Output() closeMortgageButtonClicked = new EventEmitter<any>();
  mortgageForm!: FormGroup;
  mortgageType = CommonConstants.mortgageType;
  mortgageStatus = CommonConstants.mortgageStatus;
  mortgageHolder = CommonConstants.mortgageHolder;
  applicant = '';

  ngOnInit(): void {
    this.mortgageForm = this.fb.group({
      mortgageType: [''],
      mortgagePayment: [''],
      mortgageAmount: [''],
      mortgageHolder: [''],
      marketValue: [''],
      status: [''],
    });

    this.applicant = `${this.dataService.primaryApplicant?.firstName} ${this.dataService.primaryApplicant?.lastName}`;
  }

  submit() {
    console.log(this.mortgageForm.getRawValue());
  }

  clear() {
    this.mortgageForm.reset();
  }

  close() {
    this.closeMortgageButtonClicked.emit('mortgage');
  }
}
