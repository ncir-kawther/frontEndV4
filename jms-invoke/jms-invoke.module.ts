import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {SharedModule} from '../../shared/shared.module';
import {ChartModule} from 'angular2-chartjs';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import {FocusModule} from 'angular2-focus';
import { JmsInvokeComponent } from './jms-invoke.component';
import {DataTableModule} from 'angular2-datatable';
import {AngularEchartsModule} from 'ngx-echarts';
export const ProjectRoutes: Routes = [
  {
    path: '',
    component: JmsInvokeComponent,
    data: {
      breadcrumb: 'JMS INVOKE',
      icon: 'icofont-home bg-c-blue',
      status: true
    }
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProjectRoutes),
    SharedModule,
    ChartModule,
    FormsModule, HttpClientModule,DataTableModule,AngularEchartsModule
  ],
  declarations: [JmsInvokeComponent]
})
export class JmsInvokeModule { }
