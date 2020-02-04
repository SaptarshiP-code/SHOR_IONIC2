import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LccComponent } from './components/lcc/lcc.component';
import { AddLccComponent } from './components/add-lcc/add-lcc.component';
import { UpdateLccComponent } from './components/update-lcc/update-lcc.component';


const routes: Routes = [
  { path: '', component: LccComponent },
  { path: 'add', component: AddLccComponent },
  {path:'update/:id',component:UpdateLccComponent}];
  

  @NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class DoRoutingModule { }
