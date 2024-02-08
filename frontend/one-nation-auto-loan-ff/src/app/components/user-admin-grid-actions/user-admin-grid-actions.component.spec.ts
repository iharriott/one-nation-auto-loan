import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserAdminGridActionsComponent } from './user-admin-grid-actions.component';

describe('UserAdminGridActionsComponent', () => {
  let component: UserAdminGridActionsComponent;
  let fixture: ComponentFixture<UserAdminGridActionsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UserAdminGridActionsComponent]
    });
    fixture = TestBed.createComponent(UserAdminGridActionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
