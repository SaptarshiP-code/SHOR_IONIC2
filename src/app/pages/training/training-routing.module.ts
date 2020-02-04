import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { AddTrainingComponent } from './components/add-training/add-training.component';
import { ListTrainingComponent } from './components/list-training/list-training.component';
import { TrainingComponent } from './components/training/training.component';
import { UpdateTrainingComponent} from './components/update-training/update-training.component';

const routes: Routes = [
  { path: '', component: TrainingComponent },
  { path: 'add', component: AddTrainingComponent },
  { path: 'list', component: ListTrainingComponent },
  { path: 'detail/:id', component: UpdateTrainingComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})

export class TrainingRoutingModule {}
