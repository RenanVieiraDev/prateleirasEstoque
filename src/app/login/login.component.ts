import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { Router } from '@angular/router';

//services
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public dadosLogin = new FormGroup({
    'email': new FormControl(null),
    'senha': new FormControl(null),
  });
  public loadingBtnEntrar:boolean = false;

  constructor(
    public auth:AuthService,
    public rotas:Router
  ) { }

  ngOnInit() {
  }

  login():void{
    this.loadingBtnEntrar = true;
    let authCredentsiais = `${this.dadosLogin.value.email}_${this.dadosLogin.value.senha}`;
    this.auth.login(btoa(authCredentsiais))
    .then(res=>{
      let user = `${this.dadosLogin.value.email}_${this.dadosLogin.value.senha}`
      localStorage.setItem('tokenId',btoa(user));
      this.loadingBtnEntrar = false;
      this.rotas.navigate(['/']);
    })
    .catch(err=>{this.loadingBtnEntrar = false;this.alerta(true);})
  }

  public alerta(acaoMostrar:boolean):void{
    let aviso = document.querySelector('#containerAlert');
    let img = document.querySelector('#imgAlert');
    if(acaoMostrar){
      aviso.className = 'mostraAlerta sombraVermelhaAlert bg-danger';
      img['src'] = './assets/IconesGerais/erroNotSalved.png';
      setTimeout(()=>{this.alerta(false)},2300);
    }else{
      aviso.className = 'escondeAlerta sombraVermelhaAlert bg-danger';
    }
  }

}
