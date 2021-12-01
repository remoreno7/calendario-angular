import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { EventosRoutingModule } from './eventos-routing.module';
import { AdminEventosComponent } from './admin-eventos/admin-eventos.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlatpickrModule } from 'angularx-flatpickr';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModalModule } from '@ng-bootstrap/ng-bootstrap';
import { AdminTipoEventosComponent } from './admin-tipo-eventos/admin-tipo-eventos.component';
import { MatTableModule } from  '@angular/material/table';


@NgModule({
  declarations: [
    AdminEventosComponent,
    AdminTipoEventosComponent
  ],
  imports: [
    CommonModule,
    EventosRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    NgbModalModule,
    FlatpickrModule.forRoot(),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    MatTableModule
  ]
})
export class EventosModule { }
