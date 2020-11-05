import { Injectable,EventEmitter } from '@angular/core';
import * as firebase from 'firebase';
import {CrudService} from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  public loginRealizado = new EventEmitter();

  constructor(public crud:CrudService) { }

  autenticaUsuarioLogado(auth):Promise<any>{
    return new Promise((resolve,reject)=>{
      let emailSenha = (atob(auth)).split('_')
      firebase.auth().signInWithEmailAndPassword(emailSenha[0],emailSenha[1])
      .then(res=>{resolve(res)})
      .catch(err=>{reject(err)})
    });
  }

  login(dados):Promise<any>{
    return new Promise((resolve,reject)=>{
        let emailSenha = (atob(dados)).split('_')
        firebase.auth().signInWithEmailAndPassword(emailSenha[0],emailSenha[1])
        .then(res=>{
          this.loginRealizado.emit(true);
          resolve(res);  
        })
        .catch(err=>{reject(err)})
    });
  }

  logout():Promise<any>{
    return new Promise((resolve,reject)=>{
      firebase.auth().signOut()
      .then(()=>{
          localStorage.removeItem('tokenId');
          localStorage.removeItem('firebase:host:estoqueteste-cbaaa.firebaseio.com'); //DB TESTE
          localStorage.removeItem('firebase:host:estoque-248ea.firebaseio.com'); //DB PROD
          localStorage.removeItem('OTelJS.ClientId');
          localStorage.removeItem('produtoAtivoNow');
          resolve('ok');
      });
    });
  }

  necessarioNivel0Teste(uid):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.crud.pegaValorNoDb(`funcionarios/${uid}`)
      .then(res=>{
        let testeNivelNumber;
        for(let key in res){testeNivelNumber =res[key].nivelStatus}
        if(testeNivelNumber === '0')resolve(true);
        reject(false);
      })
      .catch(err=>{reject(false)})
    });
  }

}
