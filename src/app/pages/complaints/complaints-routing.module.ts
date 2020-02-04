import {AddComplaintsComponent} from './component/add-complaints/add-complaints.component';
import {ListCompaintsComponent} from './component/list-compaints/list-compaints.component';
import { TransferComplaintComponent } from './component/transfer-complaint/transfer-complaint.component'
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComplaintComponent } from './component/detail-complaint/detail-complaint.component';
import { AuthGuard } from './../../shared/helpers/auth.guard'


const routes: Routes = [
  { path: 'add', component: AddComplaintsComponent,canActivate: [AuthGuard] },
  { path: '', component: ListCompaintsComponent ,canActivate: [AuthGuard]},
  { path: ':status', component: ListCompaintsComponent ,canActivate: [AuthGuard]},
  {path:'detail/:id',component:DetailComplaintComponent ,canActivate: [AuthGuard]},
  {path:'transfer/:id',component:TransferComplaintComponent ,canActivate: [AuthGuard]}
];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ComplaintsRoutingModule { }
