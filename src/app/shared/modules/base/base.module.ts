import { ButtonsComponent } from './../../components/buttons/buttons.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BaseRoutingModule } from './base-routing.module';


@NgModule({
  declarations: [ButtonsComponent],
  imports: [
    CommonModule,
    BaseRoutingModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    FormsModule,
    ReactiveFormsModule,
    ButtonsComponent
  ]
})
export class BaseModule { }
