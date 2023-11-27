import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-applicant-view',
  templateUrl: './applicant-view.component.html',
  styleUrls: ['./applicant-view.component.css'],
})
export class ApplicantViewComponent implements OnInit {
  ngOnInit(): void {
    this.dataService.getApplicantData();
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
  }

  applicant = '';
  applicantPhone: string | undefined;
  applicantAddress: string | undefined;
  applicantEmail: string | undefined;
  @Output() closeViewButtonClicked = new EventEmitter<any>();

  constructor(public dataService: DataService) {}
  close() {
    this.closeViewButtonClicked.emit('note');
  }
}
