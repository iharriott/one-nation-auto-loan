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

const routes: Routes = [
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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
