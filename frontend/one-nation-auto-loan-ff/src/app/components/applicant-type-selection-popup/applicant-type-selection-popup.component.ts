import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-applicant-type-selection-popup',
  templateUrl: './applicant-type-selection-popup.component.html',
  styleUrls: ['./applicant-type-selection-popup.component.css'],
})
export class ApplicantTypeSelectionPopupComponent {
  view!: string;
  dialogText!: string;
  constructor(
    public dialogRef: MatDialogRef<ApplicantTypeSelectionPopupComponent>,
    @Inject(MAT_DIALOG_DATA) public dialogData: any
  ) {}

  ngOnInit(): void {
    this.dialogText = this.dialogData;
    this.dialogRef.disableClose = true;
  }

  closePopup() {
    this.dialogRef.close();
  }
}
