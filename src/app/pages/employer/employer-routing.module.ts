import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UnitHeadComponent } from './components/unit-head/unit-head.component';
import { AddUnitComponent } from './components/add-unit/add-unit.component';
import { IccComponent } from './components/icc/icc.component';
import { AddIccComponent} from './components/add-icc/add-icc.component';
import {UpdateIccComponent}  from './components/update-icc/update-icc.component';

const routes: Routes = [
  { path: '', component: UnitHeadComponent },
  { path: 'add-unit', component: AddUnitComponent },
  { path: 'icc', component: IccComponent },
  { path: 'add-icc', component: AddIccComponent },
  { path: 'update-icc/:id', component: UpdateIccComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class EmployerRoutingModule { }
