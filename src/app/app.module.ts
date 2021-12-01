import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { AppComponent } from './app.component';
import { LoginComponent } from './modules/autenticacion/login/login.component';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { EncabezadoComponent } from './modules/publico/encabezado/encabezado.component';
import { PieDePaginaComponent } from './modules/publico/pie-de-pagina/pie-de-pagina.component';
import { FlatpickrModule } from 'angularx-flatpickr';
import { DatePipe } from '@angular/common';
import { AuthInterceptorService } from './services/auth-interceptor.service';

@NgModule({
  declarations: [
    AppComponent,
    EncabezadoComponent,
    PieDePaginaComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    CalendarModule,
    CalendarModule.forRoot({ provide: DateAdapter, useFactory: adapterFactory }),
    NgbModule,
    FlatpickrModule
  ],
  providers: [ {
    provide: HTTP_INTERCEPTORS,
    useClass: AuthInterceptorService,
    multi: true
  },
  DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
