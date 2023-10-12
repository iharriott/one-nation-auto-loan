import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/public/login/login.component';
import { SideNavigationComponent } from './components/side-navigation/side-navigation.component';
import { MainNavComponent } from './components/main-nav/main-nav.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ApplicantListComponent } from './components/applicant-list/applicant-list.component';

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
        path: 'dashboard',
        component: DashboardComponent,
        data: { view: 'dashboard' },
      },
      {
        path: 'applicantlist',
        component: ApplicantListComponent,
        data: { view: 'applicantlist' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
