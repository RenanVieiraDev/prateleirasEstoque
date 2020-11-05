import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

//services
import { PrateleirasService } from '../../shared/services/prateleiras.service';
import { CrudService } from '../../shared/services/crud.service';
import { AuthService } from '../../shared/services/auth.service'

@Component({
  selector: 'app-conf-prateleira',
  templateUrl: './conf-prateleira.component.html',
  styleUrls: ['./conf-prateleira.component.css']
})
export class ConfPrateleiraComponent implements OnInit {

  public dadosConfPrateleiras = new FormGroup({
    'prateleiras':new FormControl(null),
    'andares':new FormControl(null),
  });

  public quantidadeEspaco = new FormGroup({
    'quantidadeEspaco':new FormControl(null)
  });


  public organizacaoAlfabetica = ['A','B','C','D','E','F','G','H','I','J','L','M','N','O','P','Q','R','S','T','U','X','Y','Z'];
  public prateleiras:Array<object> = [];
  public primeiroIndice:number;
  public segundoIndice:number;
  public gondulaAtivaNow:String = 'A1';
  public trougleFormAcrescentaLugares:boolean = false;
  public msgAlerta:String;
  public trougleAlertaEspacosNaoVazios:boolean = false;
  public salvarConfLoading:boolean = false;
  public loadingAcesso:boolean = true;
  public negarAcesso:boolean = true;
  public configStart:boolean = false;
  public stopLoadingConfStart:boolean = false;
  public faseMenuLateral:number = 0;
  public trougleMenuLateralMobile:boolean = false;
  public trougleMudaLetraPrateleira:boolean = false;
  public mudaLetraPrateleiraNow:Object;
  public indicePrateleiraAtivaNow:any;
  public trougleNivelDeAcessoNegadoPor:boolean = false;
  
  constructor(
    public prateleiraSys:PrateleirasService,
    public crud:CrudService,
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
      this.pegaDocumentoParaInicio()
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

  async pegaDocumentoParaInicio(){
      const documentoPrateleira = await this.crud.pegaValorNoDb('/configPrateleiras');
      if(documentoPrateleira === null){
        this.faseMenuLateral = 0;
        this.configStart = true;
        this.stopLoadingConfStart = true;
      }else{
        this.stopLoadingConfStart = true;
        this.configStart = false;
        this.prateleiras = documentoPrateleira.esquemaPrateleiras;
      }
  }

  public montaArrayDadosPrateleiras():void{
    
    this.prateleiraSys.validaDadosConfPrateleiras(this.dadosConfPrateleiras.value)
    .then((res)=>{
      this.prateleiras = []
      let andaresAtual:Array<object>=[];
      for(let key1=0;key1 < this.dadosConfPrateleiras.value.prateleiras;key1++){
        andaresAtual = [];
        this.prateleiras[key1] = {letraPrateleira:this.organizacaoAlfabetica[key1]}
        for(let key2=this.dadosConfPrateleiras.value.andares;key2 > 0;key2--){
          andaresAtual.push({andares:this.organizacaoAlfabetica[key1]+key2,espacos:[{espaco:1,quantidadeProdutoArmazenado:0,descProduto:null}]})
        }
        this.prateleiras[key1]['andares'] = andaresAtual;
      }
    })
    .catch((err)=>{
      this.alerta(err,true,true);
    });
   
  }

  public trougleFormEPegaIndicesDeGondulas(primeiro,segundo,gondula):void{
    this.primeiroIndice = parseInt(primeiro);
    this.segundoIndice = parseInt(segundo);
    this.gondulaAtivaNow = gondula;
    this.trougleFormAcrescentaLugares = this.trougleFormAcrescentaLugares === false ? true : false;
  }

  public montaEspacoEmGondula():void{
    for(let x=1;x<=this.quantidadeEspaco.value.quantidadeEspaco;x++){
      this.prateleiras[this.primeiroIndice]['andares'][this.segundoIndice]['espacos'].push({espaco:1,quantidadeProdutoArmazenado:0,descProduto:null});
    }
    this.quantidadeEspaco.reset();
    this.trougleFormEPegaIndicesDeGondulas(1000,1000,'');
  }

  public apagaPratileirasParsialmente():void{
    this.prateleiras = [];
  }

  public alerta(msg,mostrar:boolean,error:boolean):void{
    let aviso = document.querySelector('#containerAlert');
    let img = document.querySelector('#imgAlert');

    if(mostrar){
      if(error){
        aviso.className = 'mostraAlerta sombraVermelhaAlert bg-danger';
        img['src'] = './assets/IconesGerais/erroNotSalved.png';
        setTimeout(()=>{this.alerta('',false,false)},2900);
      }else{
        aviso.className = 'mostraAlerta sombraVerdeAlert bg-success';
        img['src'] = './assets/IconesGerais/cheked.png';
        setTimeout(()=>{this.alerta('',false,false)},2900);
      }
      this.msgAlerta = msg;
    }else{
      aviso.className = 'escondeAlerta'
    }
   
  }

  public salvaTabelaDePrateleirasInDb():void{
    this.salvarConfLoading = true;
     let valorInDB = {
      esquemaPrateleiras: this.prateleiras,
      criadoPor:{_id:'0',Nome:"Renan Vieira",nivel:0}
    }
   
    this.crud.insereValorNoDb('/configPrateleiras',valorInDB)
    .then((ok)=>{
      this.alerta('Documento salvo com sucesso!',true,false);
      this.salvarConfLoading = false;
      this.pegaDocumentoParaInicio();
    })
    .catch((err)=>{
      this.alerta(err,true,true);
    });

  }

  acrescentaUnicaPrateleira():void{
    const numeroAndares = document.querySelector('#andarsNumber');
    let dados = {valorInpt:parseInt(numeroAndares['value']),totPrat:this.prateleiras.length}
    this.prateleiraSys.validaTotalAcrescimoPrat(dados)
    .then(async res=>{
      //let ultimaLetra = this.organizacaoAlfabetica[this.prateleiras.length];
      //console.log(ultimaLetra);
     let letraFaltando = await this.encontraLetraVazia();
     let organiza = [];
     var keyAtual = 0;

     for(let key in this.prateleiras){
        keyAtual = parseInt(key);
        if(keyAtual >= letraFaltando.indice){
          if(keyAtual === letraFaltando.indice){organiza[letraFaltando.indice] = {espaco:'resevado'}}
          organiza[keyAtual + 1] = this.prateleiras[key];
        }else{
          organiza[keyAtual] = this.prateleiras[key];
        }
     }
      let totAndares = [];
      for(let key = 0;key < numeroAndares['value'];key++){totAndares.push({andares:letraFaltando.letras+(key+1),espacos:[{espaco: 1, quantidadeProdutoArmazenado: 0}]})}
      organiza[letraFaltando.indice] = {andares:totAndares,letraPrateleira:`${letraFaltando.letras}`};
      this.prateleiras = organiza;
      numeroAndares['value'] = '';
    })
    .catch(err=>{
      console.log(`Alerta error => ${err}`);
    })
  }

  async encontraLetraVazia(){
    let letrasExistentes = [];
    for(let key in this.prateleiras)letrasExistentes.push(this.prateleiras[key]['letraPrateleira']);
    for(let key in this.organizacaoAlfabetica){
     if(letrasExistentes.indexOf(this.organizacaoAlfabetica[key]) === -1){
       return {letras:this.organizacaoAlfabetica[key],indice:parseInt(key)};
      }
    }
  }

 async deletaPrateleira(object,indicePrat){
    if(this.verificaSeTemItensEmPrateleira(object)){
      this.alerta('Não pode remover a prateleira por que tem itens nela!',true,true);
      return false;
    }
    if(this.verificaParaDletarConfPratInDb(this.prateleiras)){
      this.prateleiras.splice(indicePrat,1);
      await this.crud.deletaValorNoDb(`configPrateleiras`);
      await this.pegaDocumentoParaInicio();
      return false
    }
    this.prateleiras.splice(indicePrat,1)
  }

  verificaParaDletarConfPratInDb(totPrat:Array<object>):boolean{
    if(totPrat.length <= 1){
      return true;
    }else{
      return false;
    }
  }

  verificaSeTemItensEmPrateleira(prateleira):boolean{
    let haveItensInPrateleira = false;
    for(let key in prateleira.andares){
      for(let key2 in prateleira.andares[key].espacos){
        if(prateleira.andares[key].espacos[key2].quantidadeProdutoArmazenado === 1){
          haveItensInPrateleira = true;
        } 
      }
     }
     return haveItensInPrateleira;
  }

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

  public trougleEditLetraPrat(prateleira,indicePrat):void{
    this.trougleMudaLetraPrateleira = this.trougleMudaLetraPrateleira === false ? true:false;
    this.mudaLetraPrateleiraNow = prateleira
    this.indicePrateleiraAtivaNow = indicePrat;
    console.log(this.mudaLetraPrateleiraNow)
  }

  public letrasParaMudarInPrateleira(letra):void{
    this.mudaLetraPrateleiraNow['letraPrateleira'] = (letra.value).toUpperCase();
    let keyEspaco = this.mudaLetraPrateleiraNow['andares'].length;

   for(let key in this.mudaLetraPrateleiraNow['andares']){
     let letraAndar = (letra.value).toUpperCase() + Math.abs(parseInt(key)-keyEspaco)
     this.mudaLetraPrateleiraNow['andares'][key]['andares'] = letraAndar
   }
    this.prateleiras[this.indicePrateleiraAtivaNow] = this.mudaLetraPrateleiraNow;
    this.trougleEditLetraPrat({},null)
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
