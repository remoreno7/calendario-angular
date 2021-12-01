import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/autenticacion/login/login.component';
import { PaginaNoEncontradaComponent } from './modules/publico/pagina-no-encontrada/pagina-no-encontrada.component';

const routes: Routes = [
  {
    path:"login",
    component:LoginComponent
  },
  {
    path:"",
    pathMatch:"full",
    redirectTo:"/login"
  },
  {
    path:"home",
    loadChildren:() =>import('./modules/eventos/eventos.module').then(m => m.EventosModule)
  },
  {
    path:"**",
    component:PaginaNoEncontradaComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
