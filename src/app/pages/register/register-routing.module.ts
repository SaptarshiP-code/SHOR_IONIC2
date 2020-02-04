import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RegisterComponent } from './components/register/register.component';
import { EmployerComponent } from './components/employer/employer.component' ;

const routes: Routes = [
  { path: '', component: RegisterComponent },
  { path: 'employer', component: EmployerComponent },
  { path: 'other', component: RegisterComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RegisterRoutingModule { }
