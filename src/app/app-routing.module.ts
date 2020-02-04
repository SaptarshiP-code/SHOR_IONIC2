import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResourceComponent } from './pages/resources/components/resource/resource.component';
import { AuthGuard } from './shared/helpers/auth.guard'
import { HistoryComponent } from './pages/history/history.component'; 
import { DmdeskComponent } from './pages/dmdesk/dmdesk.component';
import { ContactusComponent } from './pages/contactus/contactus.component';
import { PrivacypolicyComponent } from './pages/privacypolicy/privacypolicy.component';
import {OrgregistrationComponent} from './pages/orgregistration/orgregistration.component';


const routes: Routes = [
  {
    path: '',
    loadChildren: './pages/landing/landing.module#LandingModule'
  },
  {
    path: 'login/:type',
    loadChildren: './pages/login/login.module#LoginModule'
  },
  {
    path: 'register',
    loadChildren: './pages/register/register.module#RegisterModule'
  },
  {
    path:'reset-password',
    loadChildren: './pages/forgot-password/forgot-password.module#ForgotPasswordModule'
  },
  {
    path: 'home',
    loadChildren: './pages/dashboard/dashboard.module#DashboardModule'
  },
  {
    path: 'complaints',
    loadChildren: './pages/complaints/complaints.module#ComplaintsModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'trainings',
    loadChildren: './pages/training/training.module#TrainingModule'
  },
  {
    path: 'employer',
    loadChildren: './pages/employer/employer.module#EmployerModule',
    canActivate: [AuthGuard]
  },
  {
    path: 'faq',
    loadChildren: './pages/faq/faq.module#FaqModule'
  },
  {
    path: 'do',
    loadChildren: './pages/do/do.module#DoModule',
    canActivate: [AuthGuard]
  },
  {
    path:'resources',
    component: ResourceComponent
  },
  // {
  //   path: 'training',
  //   component: TrainingComponent
  // },
  {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'dm-desk',
    component: DmdeskComponent
  },
  {
    path: 'contact-us',
    component: ContactusComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacypolicyComponent
  },
  {
    path: 'organisation-registration',
    component: OrgregistrationComponent 
  },
  {
    path: 'report',
    loadChildren: './pages/report/report.module#ReportModule',
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
