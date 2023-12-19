import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AffiliateListComponent } from './affiliate-list.component';

describe('AffiliateListComponent', () => {
  let component: AffiliateListComponent;
  let fixture: ComponentFixture<AffiliateListComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AffiliateListComponent]
    });
    fixture = TestBed.createComponent(AffiliateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
