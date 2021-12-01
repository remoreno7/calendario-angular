import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PublicoRoutingModule } from './publico-routing.module';
import { PaginaNoEncontradaComponent } from './pagina-no-encontrada/pagina-no-encontrada.component';
import { EncabezadoComponent } from './encabezado/encabezado.component';
import { PieDePaginaComponent } from './pie-de-pagina/pie-de-pagina.component';
import { ModalComponent } from './modal/modal.component';


@NgModule({
  declarations: [
    PaginaNoEncontradaComponent,
    EncabezadoComponent,
    PieDePaginaComponent,
    ModalComponent
  ],
  imports: [
    CommonModule,
    PublicoRoutingModule
  ]
})
export class PublicoModule { }
