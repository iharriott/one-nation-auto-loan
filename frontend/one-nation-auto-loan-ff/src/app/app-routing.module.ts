import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/public/login/login.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApplicantListComponent } from './components/applicant-list/applicant-list.component';
import { AgGridListComponent } from './components/ag-grid-list/ag-grid-list.component';
import { AnalyticsComponent } from './components/analytics/analytics.component';
import { ApplicantViewComponent } from './components/applicant-view/applicant-view.component';
import { SignupComponent } from './components/public/signup/signup.component';
import { authGuard } from './guards/auth.guard';
import { VehicleComponent } from './components/vehicle/vehicle.component';
import { AffiliateComponent } from './components/affiliate/affiliate.component';
import { AffiliateListComponent } from './components/affiliate-list/affiliate-list.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { UserAdminComponent } from './components/user-admin/user-admin.component';
import { UserAdminListComponent } from './components/user-admin-list/user-admin-list.component';
import { EmailSubscriptionComponent } from './components/email-subscription/email-subscription.component';

const routes: Routes = [
  {
    path: 'outsideaffiliate',
    component: AffiliateComponent,
    data: { view: 'outsideaffiliate' },
  },
  {
    path: '',
    component: MainNavComponent,
    children: [
      {
        path: 'login',
        component: LoginComponent,
        data: { view: 'login' },
      },
      {
        path: 'signup',
        component: SignupComponent,
        data: { view: 'signup' },
      },
      {
        path: 'dashboard',
        component: DashboardComponent,
        data: { view: 'dashboard' },
        canActivate: [authGuard],
      },
      {
        path: 'applicantlist',
        component: ApplicantListComponent,
        data: { view: 'applicantlist' },
      },
      {
        path: 'aggridlist',
        component: AgGridListComponent,
        data: { view: 'aggridlist' },
      },
      {
        path: 'analytics',
        component: AnalyticsComponent,
        data: { view: 'analytics' },
      },
      {
        path: 'applicantview',
        component: ApplicantViewComponent,
        data: { view: 'view' },
      },
      {
        path: 'vehicle',
        component: VehicleComponent,
        data: { view: 'vehicle' },
      },
      {
        path: 'affiliate',
        component: AffiliateComponent,
        data: { view: 'affiliate' },
      },
      {
        path: 'affiliatelist',
        component: AffiliateListComponent,
        data: { view: 'affiliatelist' },
      },
      {
        path: 'passwordupdate',
        component: ForgotPasswordComponent,
        data: { view: 'passwordupdate' },
      },
      {
        path: 'useradmin',
        component: UserAdminComponent,
        data: { view: 'useradmin' },
      },
      {
        path: 'useradminlist',
        component: UserAdminListComponent,
        data: { view: 'useradminlist' },
      },
      {
        path: 'subscribe',
        component: EmailSubscriptionComponent,
        data: { view: 'subscribe' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
