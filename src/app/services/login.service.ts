import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LoginModel } from '../models/login-model';
import { BehaviorSubject, Observable } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  private loggedIn = new BehaviorSubject<boolean>(false);
  message : string = "";
  showMessage: boolean = false ;
  constructor( 
    private http: HttpClient,
    private router: Router) { 
    }

    urlbase: string= environment.urlApi;

    validarLogin(login: LoginModel){
      const url = `${this.urlbase}/api/auth/login`;
      this.http.post<string>(url,login).subscribe((datos) =>{
        this.loggedIn.next(true);
        localStorage.setItem('jwt', datos);
          this.router.navigate(['/home']);
  
      }, (e: any) => {
        this.message = "Usuario o contraseña incorrectos";
        this.showMessage = true;
      });
    }

    logout(){
      const url = `${this.urlbase}/api/auth/logout`;
      return this.http.get<string>(url).subscribe((datos) =>{
        this.loggedIn.next(false);
        localStorage.removeItem('jwt');
          this.router.navigate(['/']);
      });
    }

    get isLoggedIn() {
      return this.loggedIn.asObservable();
    }

    get isShowMessage(){
      return this.showMessage;
    }

    get getMessage(){
      return this.message;
    }
}
