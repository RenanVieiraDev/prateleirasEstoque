import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Router } from '@angular/router';

//service
import { CrudService } from '../../shared/services/crud.service';
import { ProductService } from '../../shared/services/product.service';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-add-produto',
  templateUrl: './add-produto.component.html',
  styleUrls: ['./add-produto.component.css']
})
export class AddProdutoComponent implements OnInit {

  public ListOfPrateleiras:Array<object>;
  public listaDeEspacos:Array<String> = [];
  public documentPratileirasInDB:Array<Object>;
  public trougleMapaPrateleiras:boolean = false;
  public localArmazenamento:Object;
  public documentoPrateleira;
  public loadingSaveProduto:boolean = false;
  public dadosProduto = new FormGroup({
    'tipoPapel':new FormControl(null),
    'nomePapel':new FormControl(null),
    'gramagemPapel':new FormControl(null),
    'tamanhoPapel':new FormControl(null),
    'fornecedorPapel':new FormControl(null),
    'quantidadePapel':new FormControl(null),
    'observaçõesPapel':new FormControl(null),
    'localPapel':new FormControl(null)
  });

  public msgAlerta:String = '';
  public negarAcesso:boolean = true;
  public loadingAcesso:boolean = true;
  public indice1;
  public indice2;
  public indice3;
  public trougleNivelDeAcessoNegadoPor:boolean = false;

  constructor(
    public crud:CrudService,
    public produto:ProductService,
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
        this.pegaLocaisEspaçosArmazenamentoProdutoPrateleiras();
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

  async pegaLocaisEspaçosArmazenamentoProdutoPrateleiras(){
    this.documentoPrateleira = await this.crud.pegaValorNoDb('/configPrateleiras');
    this.ListOfPrateleiras = this.documentoPrateleira.esquemaPrateleiras;
    //console.table(this.documentoPrateleira);
  }

  public salvarProduto():void{
    this.loadingSaveProduto = true;
    this.produto.validaDadosProdutoParaSalvarInDB(this.dadosProduto.value)
    .then(()=>{
      this.modificaValorDocumentoPrateleiro(this.indice1,this.indice2,this.indice3);
      let produto = this.dadosProduto.value
      let tagsSemFormat = `${this.dadosProduto.value.tipoPapel} ${this.dadosProduto.value.nomePapel} ${this.dadosProduto.value.gramagemPapel} ${this.dadosProduto.value.tamanhoPapel} ${this.dadosProduto.value.fornecedorPapel}`;
      produto.tags = ((tagsSemFormat.trim()).toLowerCase()).split(' ');
      
      this.crud.acrescentaValorNoDb("/product",produto).then(res=>{
        let prateleira = this.localArmazenamento['prateleira'];
        let andar = this.localArmazenamento['andar'];
        let espaco = this.localArmazenamento['espaco'];
        this.ListOfPrateleiras[prateleira]['andares'][andar]['espacos'][espaco]['descProduto'][0]._idProd = res.path.pieces_[1];
        this.documentoPrateleira['esquemaPrateleiras'] = this.ListOfPrateleiras;
        this.crud.insereValorNoDb('/configPrateleiras',this.documentoPrateleira)
        .then(ok=>{
          this.alerta('Salvo com sucesso!',true,false);
          this.dadosProduto.reset();
          this.loadingSaveProduto = false;
        })
        .catch(err=>{
          this.alerta(err,true,true);
          this.loadingSaveProduto = false;
        })
       
      })
      .catch((err)=>{
        this.loadingSaveProduto = false;
        this.alerta(err,true,true);
      })
    })
    .catch((msg)=>{
      this.loadingSaveProduto = false;
      this.alerta(msg,true,true);
    });
  }

  public modificaValorDocumentoPrateleiro(indice1,indice2,indice3):void{

    this.ListOfPrateleiras[indice1]['andares'][indice2]['espacos'][indice3].quantidadeProdutoArmazenado = 1;
    this.ListOfPrateleiras[indice1]['andares'][indice2]['espacos'][indice3].descProduto =[ {
      'tipoPapel':this.dadosProduto.value.tipoPapel,
      'nomePapel':this.dadosProduto.value.nomePapel,
      'gramagemPapel':this.dadosProduto.value.gramagemPapel,
      'tamanhoPapel':this.dadosProduto.value.tamanhoPapel,
      'fornecedorPapel':this.dadosProduto.value.fornecedorPapel,
      'quantidadePapel':this.dadosProduto.value.quantidadePapel
    }];
    this.localArmazenamento = {prateleira:indice1,andar:indice2,espaco:indice3}
  }

  public trougleMapaDocumentoPrateleiras():boolean{
    if(this.dadosProduto.value.tipoPapel === null){ this.alerta('Por favor informe todos os dados do papel!',true,true);return false;};
    if(this.dadosProduto.value.nomePapel === null) { this.alerta('Por favor informe todos os dados do papel!',true,true);return false;};
    if( (this.dadosProduto.value.nomePapel).length < 2) { this.alerta('Nome do papel muito curto!',true,true);return false;};
    if(this.dadosProduto.value.gramagemPapel === null) { this.alerta('Por favor informe todos os dados do papel!',true,true);return false;};
    if(this.dadosProduto.value.tamanhoPapel === null) { this.alerta('Por favor informe todos os dados do papel!',true,true);return false;};
    if(this.dadosProduto.value.fornecedorPapel === null) { this.alerta('Por favor informe todos os dados do papel!',true,true);return false;};
    if(!this.ListOfPrateleiras){this.alerta('Configure as prateleiras do estoque para continuar!',true,true);return false;}
    this.trougleMapaPrateleiras = this.trougleMapaPrateleiras === false ? true : false
    return true;
  }

  public setaValorIninputLocal(acao,letra,indice1,indice2,indice3):void{
    if(acao === 0){
      this.indice1 = indice1;
      this.indice2 = indice2;
      this.indice3 = indice3;
      document.querySelector('#armazenamentolocalId')['value'] = `${letra}_${indice3+1}`;
      this.dadosProduto.value.localPapel = {letra:letra,prateleira:indice1,andar:indice2,espaco:indice3};
      this.trougleMapaDocumentoPrateleiras();
    }
  }

  public alerta(msg,mostrar:boolean,error:boolean):void{
    let aviso = document.querySelector('#containerAlert');
    let img = document.querySelector('#imgAlert');

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
      this.msgAlerta = msg;
    }else{
      aviso.className = 'escondeAlerta'
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
