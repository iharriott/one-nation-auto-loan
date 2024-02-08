import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateGridActionsComponent } from './affiliate-grid-actions.component';

describe('AffiliateGridActionsComponent', () => {
  let component: AffiliateGridActionsComponent;
  let fixture: ComponentFixture<AffiliateGridActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateGridActionsComponent]
    });
    fixture = TestBed.createComponent(AffiliateGridActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
