import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//services
import { AuthService } from '../../shared/services/auth.service'

@Component({
  selector: 'app-conf-funcionario',
  templateUrl: './conf-funcionario.component.html',
  styleUrls: ['./conf-funcionario.component.css']
})
export class ConfFuncionarioComponent implements OnInit {

  public telaView:number = 1;
  public loadingAcesso:boolean = true;
  public negarAcesso:boolean = true;
  public msgAlerta;
  public trougleMenuLateralMobile:boolean = false;
  public trougleNivelDeAcessoNegadoPor:boolean = false;

  constructor(
    public auth:AuthService,
    public rotas:Router
  ) { }

  ngOnInit() {
    this.auth.autenticaUsuarioLogado(localStorage.getItem('tokenId'))
    .then(res=>{
      this.auth.necessarioNivel0Teste(res.user.uid)
      .then(res=>{
        this.loadingAcesso = false;
        this.negarAcesso = false;
      })
      .catch(err=>{
        this.trougleNivelDeAcessoNegado();
      })
    })
    .catch(err=>{
      this.loadingAcesso = false;
      this.negarAcesso = true;
      this.rotas.navigate(['/login']);
    })
  }

  public mudaTelaView(tela:number):void{this.telaView = tela;}

  public trougleMenuLateralMObile():void{
    const container = document.querySelector('#menuLateralSearch');
    const formsSearch = document.querySelector('#menuLat');
    this.trougleMenuLateralMobile = this.trougleMenuLateralMobile === false ? true:false;
    if(this.trougleMenuLateralMobile){
      container.className = 'menuLateralEspandido'
      formsSearch.className = ''
    }else{
      container.className = 'col-2';
      formsSearch.className = 'd-none d-lg-block';
    }
  }

  public trougleNivelDeAcessoNegado():void{
    this.trougleNivelDeAcessoNegadoPor = this.trougleNivelDeAcessoNegadoPor === false?true:false;
  }

  public voltarInicio():void{
    this.trougleNivelDeAcessoNegadoPor = false;
    this.trougleNivelDeAcessoNegadoPor = true;
    this.rotas.navigate(['/']);
  }

}
