import { Component, OnInit } from '@angular/core';

//services
import { CrudService } from '../shared/services/crud.service';
import { SearchService } from '../shared/services/search.service';
import { ProductService } from '../shared/services/product.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public prateleiras:Array<object> = [];
  public searchFilter:Array<object> = [];
  public loadingPrateleiras:boolean = true;
  public popupDescProd = false;
  public descProdAtualPopup:object;
  public trougleMenuLateralMobile:boolean = false;
  

  constructor(
    public crud:CrudService,
    public searchServic:SearchService,
    public prodServc:ProductService
  ) { }

  async ngOnInit() {
    this.searchServic.searchEvent.subscribe(res=>{
      this.searchFilter = [];
      if(res.length != 0) this.searchFilter = res;
    });
    this.prodServc.atualizaListProd.subscribe(res=>{this.pegaDocumentoParaInicio();})
    await this.pegaDocumentoParaInicio();
  }

 

   pegaDocumentoParaInicio():void{
    this.crud.pegaValorNoDb('/configPrateleiras')
    .then(documentoPrateleira=>{
      if(documentoPrateleira === null){
        this.loadingPrateleiras = false
      }else{
        this.prateleiras = documentoPrateleira.esquemaPrateleiras;
      } 
    })
    .catch(err=>{
    })
}

  public indicaLocalArmazenamento(dadosProduto,produto):void{
    let espacoAmazenagem = document.querySelector('#'+dadosProduto)
    espacoAmazenagem.className = `col m-1 espacoCardIluminar animate__animated animate__heartBeat`;
    setTimeout(()=>{espacoAmazenagem.className=`col m-1 espacoCard1`},4000);
    this.setaValorDadosProdutoParaRodape(produto);
    if(window.screen.width < 992)this.trougleMenuLateralMObile();
    this.scrollIndicaLocal(espacoAmazenagem)
  }

  public scrollIndicaLocal(idContainer):void{
    const container = document.querySelector('#containerTelaPrateleiraHome');
    container.scrollTo({
      top:idContainer.offsetTop+20,
      behavior:"smooth"
    })
  }

  public setaValorDadosProdutoParaRodape(dadosProd):void{
    this.searchServic.ativarBotoesAddeDel(dadosProd);
  }

  public mostraPopupDescProduto(existeProd,dadosProd):void{
    if(existeProd > 0){
      this.descProdAtualPopup = dadosProd.descProduto[0];
      this.popupDescProd =  this.popupDescProd === false?true:false;
    }
  }

  public fecharPoPupDescProd():void{
    this.popupDescProd = false;
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

  async searchProdMobile(pesquisa){
    this.searchServic.searchInMobile(pesquisa)
   } 

}
