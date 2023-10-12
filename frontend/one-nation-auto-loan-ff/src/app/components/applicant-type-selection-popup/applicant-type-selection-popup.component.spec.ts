import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ApplicantTypeSelectionPopupComponent } from './applicant-type-selection-popup.component';

describe('ApplicantTypeSelectionPopupComponent', () => {
  let component: ApplicantTypeSelectionPopupComponent;
  let fixture: ComponentFixture<ApplicantTypeSelectionPopupComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ApplicantTypeSelectionPopupComponent]
    });
    fixture = TestBed.createComponent(ApplicantTypeSelectionPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
