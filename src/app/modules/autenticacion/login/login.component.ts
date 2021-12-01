import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { LoginModel } from 'src/app/models/login-model';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;
  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    public router: Router
  ) { 
    this.loginForm= this.createFormGroup(formBuilder)
  }

  private loggedIn = new BehaviorSubject<boolean>(false);
  message : string = "";
  showMessage: boolean = false ;

  ngOnInit(): void {
  }

  createFormGroup(formBuilder: FormBuilder){
    return formBuilder.group({
      nombre: ['', Validators.required],
      password: ['', Validators.required]
    })
  }

  validarLogin(){
    const login: LoginModel = Object.assign({}, this.loginForm?.value);
    localStorage.removeItem('jwt');
    this.loginService.validarLogin(login);

    this.showMessage = this.loginService.isShowMessage;
    this.message = this.loginService.getMessage;
  }

  public get isLoggedIn() {
    return this.loggedIn.asObservable();
  }

  reset(){
    this.loginForm?.reset();
  }

  ocultarMensaje(){
      this.showMessage = false;
  }

}
