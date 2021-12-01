import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminEventosComponent } from './admin-eventos/admin-eventos.component';
import { AdminTipoEventosComponent } from './admin-tipo-eventos/admin-tipo-eventos.component';

const routes: Routes = [
  {
    path:"",
    component:AdminEventosComponent
    },
    {
      path:"tipos-eventos",
      component:AdminTipoEventosComponent
      }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EventosRoutingModule { }
