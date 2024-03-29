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
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { AgGridListComponent } from './ag-grid-list/ag-grid-list.component';
import { GridDeleteComponent } from './grid-delete/grid-delete.component';
import { PinIconHooverDirective } from './directives/pin-icon-hoover.directive';
import { CustomSidenavComponent } from './custom-sidenav/custom-sidenav.component';
import { AnalyticsComponent } from './analytics/analytics.component';
import { ApplicantViewComponent } from './applicant-view/applicant-view.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { AffiliateListComponent } from './affiliate-list/affiliate-list.component';
import { AffiliateComponent } from './affiliate/affiliate.component';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { AffiliateGridActionsComponent } from './affiliate-grid-actions/affiliate-grid-actions.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { UserAdminComponent } from './user-admin/user-admin.component';
import { UserAdminListComponent } from './user-admin-list/user-admin-list.component';
import { UserAdminGridActionsComponent } from './user-admin-grid-actions/user-admin-grid-actions.component';
import { EmailSubscriptionComponent } from './email-subscription/email-subscription.component';
//import { MDBModalRef, MDBModalService } from '';

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
    DeleteDialogComponent,
    AgGridListComponent,
    GridDeleteComponent,
    PinIconHooverDirective,
    CustomSidenavComponent,
    AnalyticsComponent,
    ApplicantViewComponent,
    VehicleComponent,
    AffiliateListComponent,
    AffiliateComponent,
    DateFormatPipe,
    AffiliateGridActionsComponent,
    ForgotPasswordComponent,
    UserAdminComponent,
    UserAdminListComponent,
    UserAdminGridActionsComponent,
    EmailSubscriptionComponent,
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
