import { Component, OnInit } from '@angular/core';
import { FormGroup,FormControl } from '@angular/forms';
import { Router } from '@angular/router'



//services
import { SearchService } from '../shared/services/search.service';
import { AuthService } from '../shared/services/auth.service';
import { CrudService } from '../shared/services/crud.service';
import { ProductService } from '../shared/services/product.service';
import { PrateleirasService } from '../shared/services/prateleiras.service';
import { OrdenService } from '../shared/services/orden.service';

@Component({
  selector: 'app-rodape',
  templateUrl: './rodape.component.html',
  styleUrls: ['./rodape.component.css']
})
export class RodapeComponent implements OnInit {

  public valorTipoPapelSet:string;
  public valorTamanhoPapelSet:string;
  public msgAlerta:String;
  public produtoAtivoNow:Object = null;
  public addProdutoContainer:boolean = false;
  public retirarProdutoContainer:boolean = false;
  public loadingSubmitFormADDUn:boolean = false;
  public loadingSubmitFormRetirarUn:boolean = false;
  public loginNecessario:boolean = false;
  public addProduto = new FormGroup({
    'quantidadeUN':new FormControl(null),
  });

  public retiraProduto = new FormGroup({
    'ordemServico':new FormControl(null),
    'qPlanos':new FormControl(null),
    'qAfinacao':new FormControl(null),
    'tamanhoCorte':new FormControl(null),
    'tipoPapel':new FormControl(null),
    'tamanhoPapel':new FormControl(null),
    'quantidadeRetirar':new FormControl(null)
  });


  constructor(
    public searchServic:SearchService,
    public authServic:AuthService,
    public rotas:Router,
    public crud:CrudService,
    public prodServi:ProductService,
    public prateleiraServic:PrateleirasService,
    public orden:OrdenService
  ) { }

  ngOnInit() {
    this.searchServic.dadosProdutoAtivoNow.subscribe(res=>{
      this.produtoAtivoNow = res;
      setTimeout(()=>{
        this.produtoAtivoNow = null;
        if(this.addProdutoContainer){this.addProdutoContainer=false}
        if(this.retirarProdutoContainer){this.retirarProdutoContainer=false}
      },60*1000);
    });
  }

  public addUNProduto():void{
    this.loadingSubmitFormRetirarUn = true;
    this.authServic.autenticaUsuarioLogado(localStorage.getItem('tokenId'))
    .then( async res1=>{
      this.prodServi.validaCampoParaAcrescimoUN(this.addProduto.value)
      .then(async res2=>{
        
        let totalAtual = await this.prodServi.acrescentaUNProd(this.produtoAtivoNow['id_prod'],this.addProduto.value.quantidadeUN)//atualiza Produto
            await this.prateleiraServic.alteraValorQuantidadeProdutoEmPrateleira(this.produtoAtivoNow['localPapel'],totalAtual)//Atualisa prateleiras
            this.addProduto.value.ADMId = res1.user.uid;
            this.addProduto.value.ADMEmail = res1.user.email;
            this.addProduto.value.tipoDocumento = 1;
            this.addProduto.value.dataRegistro = new Date()
            let ordenService = await this.crud.acrescentaValorNoDb('ordenService',this.addProduto.value) //acrescenta relatorio de fluxo
            let ordemModelService = {
              'admId':res1.user.uid,
              'admEmail':res1.user.email,
              'tipoDocumento':1,
              'ordemServico':'Entrada Unidade',
              'gramagem':this.produtoAtivoNow['gramagemPapel'],
              'fornecedor':this.produtoAtivoNow['fornecedorPapel'],
              'nomePapel':this.produtoAtivoNow['nomePapel'],
              'tipoPapel':this.produtoAtivoNow['tipoPapel'],
              'tamanhoPapel':this.produtoAtivoNow['tamanhoPapel'],
              'quantidadeAcrescentada':this.addProduto.value.quantidadeUN
            }
            ordemModelService['id_orden'] = ordenService.path.pieces_[1];
            ordemModelService['retirada'] = 'Não';
            this.addProduto.reset();
            this.loadingSubmitFormRetirarUn = false;
            this.prodServi.atualizaPrateleirasDeProdutosHome(); //atualiza prateleiras
            this.prodServi.atualizaListaDeProdutos();//atualiza lista de pesquisa
            
      })
      .catch(err=>{
        console.log(err);
        this.loadingSubmitFormRetirarUn = false;
      })
     
    })
    .catch(err=>{
      this.loadingSubmitFormRetirarUn = false;
      this.loginNecessario = true;
    });
  }

  retirarUNProduto():void{
    this.loadingSubmitFormRetirarUn = true;
    this.retiraProduto.value.tipoPapel = this.produtoAtivoNow['tipoPapel'];
    this.retiraProduto.value.tamanhoPapel = this.produtoAtivoNow['tamanhoPapel'];
    this.authServic.autenticaUsuarioLogado(localStorage.getItem('tokenId'))
    .then( async res1=>{
      console.log(this.retiraProduto.value);
      this.orden.validaCanpos(this.retiraProduto.value)
      .then(async res2=>{
       
        let totalAtual = await this.prodServi.atualizaQuantidadeProduto(this.produtoAtivoNow['id_prod'],this.retiraProduto.value.quantidadeRetirar)//atualiza Produto
        if(totalAtual >= 0){
            await this.prateleiraServic.alteraValorQuantidadeProdutoEmPrateleira(this.produtoAtivoNow['localPapel'],totalAtual) //Atualisa prateleiras
            this.retiraProduto.value.ADMId = res1.user.uid;
            this.retiraProduto.value.ADMEmail = res1.user.email;
            this.retiraProduto.value.tipoDocumento = 0;
            this.retiraProduto.value.dataRegistro = new Date()
            let ordenService = await this.crud.acrescentaValorNoDb('ordenService',this.retiraProduto.value) //acrescenta relatorio de fluxo
            let ordemModelService = {
              'admId':res1.user.uid,
              'admEmail':res1.user.email,
              'tipoDocumento':0,
              'ordemServico':this.retiraProduto.value.ordemServico,
              'qPlanos':this.retiraProduto.value.qPlanos,
              'qAfinacao':this.retiraProduto.value.qAfinacao,
              'tamanhoCorte':this.retiraProduto.value.tamanhoCorte,
              'tipoPapel':this.retiraProduto.value.tipoPapel,
              'tamanhoPapel':this.retiraProduto.value.tamanhoPapel,
              'quantidadeRetirar':this.retiraProduto.value.quantidadeRetirar
            }
            ordemModelService['id_orden'] = ordenService.path.pieces_[1];
            ordemModelService['retirada'] = 'Sim';
            this.retiraProduto.reset();
            this.loadingSubmitFormRetirarUn = false;
            this.prodServi.atualizaPrateleirasDeProdutosHome(); //atualiza prateleiras
            this.prodServi.atualizaListaDeProdutos();//atualiza lista de pesquisa
        }else{
          this.loadingSubmitFormRetirarUn = false;
          this.alerta('A quantidade que você quer retirar, é maior que o estoque do produto!',true,true);
        }
      })
      .catch(err=>{
        console.log(err);
        this.loadingSubmitFormRetirarUn = false;
      })
     
    })
    .catch(err=>{
      this.loadingSubmitFormRetirarUn = false;
      this.loginNecessario = true;
    });
  }

  trougleAddProdutoContainer():void{
    this.addProdutoContainer = this.addProdutoContainer ===false?true:false;
  }

  trougleRetirarProdutoContainer():void{
    this.setaValorEmCamposInputFormTipoTamanho();
    this.retirarProdutoContainer = this.retirarProdutoContainer ===false?true:false;
    this.loginNecessario = false;
  }

  setaValorEmCamposInputFormTipoTamanho():void{
    this.valorTipoPapelSet = this.produtoAtivoNow['tipoPapel'];
    this.valorTamanhoPapelSet =  this.produtoAtivoNow['tamanhoPapel'];
    this.retiraProduto.value.tipoPapel = this.produtoAtivoNow['tipoPapel'];
    this.retiraProduto.value.tamanhoPapel = this.produtoAtivoNow['tamanhoPapel'];
  }

  redirecionaParaLoginComponent(acao):void{
    localStorage.setItem('produtoAtivoNow',JSON.stringify(this.produtoAtivoNow));
    if(acao === 1){this.trougleAddProdutoContainer()}
    if(acao === 2){this. trougleRetirarProdutoContainer()}
    this.rotas.navigate(['/login'])
  }

  imprimirOrdenServiceParaAguardo():void{
    this.loadingSubmitFormRetirarUn = true;
    this.authServic.autenticaUsuarioLogado(localStorage.getItem('tokenId'))
    .then( async res1=>{
      this.retiraProduto.value.tipoPapel = this.produtoAtivoNow['tipoPapel'];
      this.retiraProduto.value.tamanhoPapel = this.produtoAtivoNow['tamanhoPapel'];
      this.orden.validaCanpos(this.retiraProduto.value)
      .then(async res2=>{
        let totalAtual = await this.prodServi.atualizaQuantidadeProduto(this.produtoAtivoNow['id_prod'],this.retiraProduto.value.quantidadeRetirar)//atualiza Produto
        if(totalAtual >= 0){
          await this.prateleiraServic.alteraValorQuantidadeProdutoEmPrateleira(this.produtoAtivoNow['localPapel'],totalAtual) //Atualisa prateleiras
          this.retiraProduto.value.ADMId = res1.user.uid;
          this.retiraProduto.value.ADMEmail = res1.user.email;
          this.retiraProduto.value.tipoDocumento = 2;
          this.retiraProduto.value.dataRegistro = new Date();
          let ordemModelService = {
            'admId':res1.user.uid,
            'admEmail':res1.user.email,
            'tipoDocumento':2,
            'ordemServico':this.retiraProduto.value.ordemServico,
            'qPlanos':this.retiraProduto.value.qPlanos,
            'qAfinacao':this.retiraProduto.value.qAfinacao,
            'tamanhoCorte':this.retiraProduto.value.tamanhoCorte,
            'tipoPapel':this.retiraProduto.value.tipoPapel,
            'tamanhoPapel':this.retiraProduto.value.tamanhoPapel,
            'quantidadeRetirar':this.retiraProduto.value.quantidadeRetirar
          }
          let ordenService = await this.crud.acrescentaValorNoDb('ordenService',ordemModelService) //acrescenta relatorio de fluxo
          ordemModelService['id_orden'] = ordenService.path.pieces_[1];
          ordemModelService['retirada'] = 'Sim';
          this.retiraProduto.reset();
          this.loadingSubmitFormRetirarUn = false;
          await this.prodServi.atualizaPrateleirasDeProdutosHome();
          await this.prodServi.atualizaListaDeProdutos();//atualiza lista de pesquisa
          await this.orden.imprimeOrden(ordemModelService); //cria modelo da ordem de serviço
        }else{
          this.loadingSubmitFormRetirarUn = false;
          this.alerta('A quantidade que você quer retirar, é maior que o estoque do produto!',true,true);
        }
      
      })
      .catch(err=>{
        console.log(err);
        this.loadingSubmitFormRetirarUn = false;
      })
     
    })
    .catch(err=>{
      this.loadingSubmitFormRetirarUn = false;
      this.loginNecessario = true;
    });
  }

  public alerta(msg,mostrar:boolean,error:boolean):void{
    let aviso = document.querySelector('#containerAlert');
    let img = document.querySelector('#imgAlert');

    if(mostrar){
      if(error){
        aviso.className = 'mostraAlerta sombraVermelhaAlert bg-danger';
        img['src'] = './assets/IconesGerais/erroNotSalved.png';
        setTimeout(()=>{this.alerta('',false,false)},4900);
      }else{
        aviso.className = 'mostraAlerta sombraVerdeAlert bg-success';
        img['src'] = './assets/IconesGerais/cheked.png';
        setTimeout(()=>{this.alerta('',false,false)},4900);
      }
      this.msgAlerta = msg;
    }else{
      aviso.className = 'escondeAlerta'
    }
   
  }


}
