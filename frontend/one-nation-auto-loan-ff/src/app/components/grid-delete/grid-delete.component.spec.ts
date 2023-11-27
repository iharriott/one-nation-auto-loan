import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GridDeleteComponent } from './grid-delete.component';

describe('GridDeleteComponent', () => {
  let component: GridDeleteComponent;
  let fixture: ComponentFixture<GridDeleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GridDeleteComponent]
    });
    fixture = TestBed.createComponent(GridDeleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
