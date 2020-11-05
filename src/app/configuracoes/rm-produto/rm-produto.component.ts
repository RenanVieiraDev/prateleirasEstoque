import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

//services
import { CrudService } from '../../shared/services/crud.service';
import { ProductService } from '../../shared/services/product.service';
import { AuthService } from '../../shared/services/auth.service';
import { PrateleirasService } from '../../shared/services/prateleiras.service'

@Component({
  selector: 'app-rm-produto',
  templateUrl: './rm-produto.component.html',
  styleUrls: ['./rm-produto.component.css']
})
export class RmProdutoComponent implements OnInit {

  public msgAlerta:String = '';
  public negarAcesso:boolean = true;
  public loadingAcesso:boolean = true;
  public listOfProducts:Array<object> = [];
  public loadingDeletProd:boolean = false;
  public produtoParaDeletarNow:Object;
  public trougleConfirmDelProd:boolean = false;
  public erroUnidadesEmEstoque:boolean = false;
  public loadingBtnDel:boolean = false;
  public deletandoprod:boolean = false;
  public trougleNivelDeAcessoNegadoPor:boolean = false

  constructor(
    public crud:CrudService,
    public produto:ProductService,
    public auth:AuthService,
    public rotas:Router,
    public prateleira:PrateleirasService
  ) { }

  ngOnInit() {
    this.auth.autenticaUsuarioLogado(localStorage.getItem('tokenId'))
    .then(res=>{
      this.auth.necessarioNivel0Teste(res.user.uid)
      .then(res=>{
        this.loadingAcesso = false;
        this.negarAcesso = false;
        this.pegaProdutosInDB();
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

  pegaProdutosInDB():void{
    this.listOfProducts = []
    this.crud.pegaValorNoDb(`/product`)
    .then(res=>{
      for(let key in res){ 
        let produto = res[key];
        produto.id_prod = key;
        this.listOfProducts.push(produto)
      }
      //console.log(this.listOfProducts);
    })
    .catch(err=>{})
  }

  trougleConfirmDelete(dadosProd):void{
    this.produtoParaDeletarNow = dadosProd;
    this.trougleConfirmDelProd = this.trougleConfirmDelProd === false?true:false;
  }

  deletaProdutoInDB(produto):void{
    if(produto.quantidadePapel === 0){
      this.loadingDeletProd = true;
      this.crud.deletaValorNoDb(`/product/${produto.id_prod}`)
      .then(async res=>{
        await this.prateleira.removeProdutoEmPrateleira(produto.localPapel);
        await this.pegaProdutosInDB();
        await this.trougleConfirmDelete([]);
        this.loadingDeletProd = false;
      })
      .catch(err=>{
        this.loadingDeletProd = false;
        //chamar função alerta / mostrar o err
      })
    }else{
      this.erroUnidadesEmEstoque = true;
      setTimeout(()=>{this.erroUnidadesEmEstoque = false;},7000);
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
