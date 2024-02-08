import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmailSubscriptionComponent } from './email-subscription.component';

describe('EmailSubscriptionComponent', () => {
  let component: EmailSubscriptionComponent;
  let fixture: ComponentFixture<EmailSubscriptionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmailSubscriptionComponent]
    });
    fixture = TestBed.createComponent(EmailSubscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
