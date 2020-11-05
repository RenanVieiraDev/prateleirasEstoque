import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import {CrudService} from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class FuncionarioService {

  constructor(public crud:CrudService) { }

  autenticaCadastro(dadosFuncionario):Promise<any>{
    console.log(dadosFuncionario)
    return new Promise((resolve,reject)=>{
      if(!this.autenticacaoNome(dadosFuncionario.nome))reject('Nome invalido!');
      if(!this.autenticacaoSobrenome(dadosFuncionario.sobrenome))reject('Sobrenome invalido!');
      if(!this.autenticaEmail(dadosFuncionario.email))reject('email é invalido!');
      if(!this.autenticaSenha(dadosFuncionario.senha))reject('senha deve ser maior que 8 digitos!');
      if(!this.validaNivelStatus(dadosFuncionario.nivelStatus))reject('E necessario escolher um nivel de acesso para cadastrar!');
      resolve('ok');
    });
  }

  autenticacaoNome(valor):boolean{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return false;
    if(valor==='')return false;
    return true;
  }

  autenticacaoSobrenome(valor):boolean{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return false;
    return true;
  }

  autenticaEmail(valor):boolean{
    if(valor){
      let emailEmpresa = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
      return emailEmpresa.test(valor);
    }else{
      return false;
    }
  }

  autenticaSenha(valor):boolean{
    let testeSenha = valor != null ? valor.length : 0
    if(testeSenha >= 8){
      return true
    }else{
      return false;
    }
  }

  cadastroEmailSenha(dadosFunc):Promise<any>{
    return new Promise((resolve,reject)=>{
      firebase.auth().createUserWithEmailAndPassword(dadosFunc.email,dadosFunc.senha)
      .then(res=>{
        resolve(res)
      })
      .catch(err=>{
        reject(err)
      })
    });
  }
  
  salvaInformacoesFuncionarioInDB(dadosFuncionario):Promise<any>{
    return new Promise((resolve,reject)=>{
      this.crud.acrescentaValorNoDb(`funcionarios/${dadosFuncionario.uid}/`,dadosFuncionario)
      .then(ok=>{resolve('ok')})
      .catch(err=>{reject(err)})
    });
  }

  public validaNivelStatus(valor):boolean{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return false;
    if(valor != '0'){if(valor != '1'){return false}}
    if(valor != '1'){if(valor != '0'){return false}}
    return true;
  }



}
