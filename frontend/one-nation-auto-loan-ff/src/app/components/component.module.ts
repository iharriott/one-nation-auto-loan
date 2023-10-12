import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './shared-modules/material/material.module';
import { HomeComponent } from './home/home.component';
import { SideNavigationComponent } from './side-navigation/side-navigation.component';
import { MainNavComponent } from './main-nav/main-nav.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { DashboardComponent } from './dashboard/dashboard.component';

import { GenericGridComponent } from './generic-grid/generic-grid.component';
import { ApplicantListComponent } from './applicant-list/applicant-list.component';
import { MortgageComponent } from './mortgage/mortgage.component';
import { EmploymentComponent } from './employment/employment.component';
import { NoteComponent } from './note/note.component';
import { ApplicantComponent } from './applicant/applicant.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { ApplicantTypeSelectionPopupComponent } from './applicant-type-selection-popup/applicant-type-selection-popup.component';

@NgModule({
  declarations: [
    HomeComponent,
    SideNavigationComponent,
    MainNavComponent,
    DashboardComponent,
    GenericGridComponent,
    ApplicantListComponent,
    MortgageComponent,
    EmploymentComponent,
    NoteComponent,
    ApplicantComponent,
    ApplicantTypeSelectionPopupComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    NgMultiSelectDropDownModule.forRoot(),
  ],
  exports: [HomeComponent, SideNavigationComponent],
})
export class ComponentModule {}
