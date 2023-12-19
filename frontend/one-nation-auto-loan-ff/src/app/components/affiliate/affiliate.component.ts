import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { DataService } from 'src/app/services/data.service';

@Component({
  selector: 'app-affiliate',
  templateUrl: './affiliate.component.html',
  styleUrls: ['./affiliate.component.css'],
})
export class AffiliateComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private dataService: DataService,
    private dialog: MatDialog,
    private apiService: ApiService
  ) {}

  affiliateForm!: FormGroup;
  private addAffiliateSubscription?: Subscription;
  @Output() closeAffiliateButtonClicked = new EventEmitter<any>();

  ngOnInit(): void {
    this.affiliateForm = this.fb.group({
      pk: [''],
      sk: [''],
      gsI1PK: [''],
      gsI1SK: [''],
      documentType: [''],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phone: ['', Validators.required],
      email: [''],
      note: [''],
    });
  }

  close() {
    this.closeAffiliateButtonClicked.emit('affiliate');
  }

  clear() {
    this.affiliateForm.reset();
  }

  submit() {
    debugger;
    console.log(this.affiliateForm.getRawValue());
  }

  ngOnDestroy(): void {
    this.addAffiliateSubscription?.unsubscribe();
  }
}
