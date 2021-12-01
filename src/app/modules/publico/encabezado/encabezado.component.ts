import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-encabezado',
  templateUrl: './encabezado.component.html',
  styleUrls: ['./encabezado.component.css']
})
export class EncabezadoComponent implements OnInit {

  isLoggedIn$: Observable<boolean> | undefined;

  constructor(private loginService: LoginService) { }

  ngOnInit(): void {

    this.isLoggedIn$ = this.loginService.isLoggedIn;

  }

  logout(): void{
    this.loginService.logout();
  }

}
