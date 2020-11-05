import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms'

//services
import { FuncionarioService } from '../../../shared/services/funcionario.service';

@Component({
  selector: 'app-cadastro-funcionario',
  templateUrl: './cadastro-funcionario.component.html',
  styleUrls: ['./cadastro-funcionario.component.css']
})
export class CadastroFuncionarioComponent implements OnInit {

  public msgAlerta:string = '';
  public dadosCadastro = new FormGroup({
    'nome':new FormControl(null),
    'sobrenome':new FormControl(null),
    'email':new FormControl(null),
    'senha':new FormControl(null),
    'nivelStatus':new FormControl(null)
  });
  public loadingSalvaoBtn:boolean = false;

  constructor(
    public funcionarioS:FuncionarioService
  ) { }

  ngOnInit() {
  }

  salvarCadastro():void{
    this.loadingSalvaoBtn = true;
    this.funcionarioS.autenticaCadastro(this.dadosCadastro.value)
    .then(res=>{
      this.funcionarioS.cadastroEmailSenha(this.dadosCadastro.value)
      .then(res=>{
        let dadosFunk = this.dadosCadastro.value;
        dadosFunk.uid = res.user.uid
        this.funcionarioS.salvaInformacoesFuncionarioInDB(dadosFunk)
        .then(ok=>{ 
          this.loadingSalvaoBtn = false;
          this.alerta('Cadastro salvo!',true,false);
          this.dadosCadastro.reset();
        })
        .catch(err=>{this.alerta(err,true,true); this.loadingSalvaoBtn = false;})
      })
      .catch(err=>{
        this.alerta(err,true,true);
        this.loadingSalvaoBtn = false;
      })
    })
    .catch(err=>{
      this.alerta(err,true,true);
      this.loadingSalvaoBtn = false;
    })
  }

  public alerta(msg,mostrar:boolean,error:boolean):void{
    let aviso = document.querySelector('#containerAlert');
    let img = document.querySelector('#imgAlert');
    this.msgAlerta = msg;
    if(mostrar){
      if(error){
        aviso.className = 'mostraAlerta sombraVermelhaAlert bg-danger';
        img['src'] = './assets/IconesGerais/erroNotSalved.png';
        setTimeout(()=>{this.alerta('',false,false)},2300);
      }else{
        aviso.className = 'mostraAlerta sombraVerdeAlert bg-success';
        img['src'] = './assets/IconesGerais/cheked.png';
        setTimeout(()=>{this.alerta('',false,false)},2900);
      }
    }else{
      aviso.className = 'escondeAlerta'
    }
  }

}
