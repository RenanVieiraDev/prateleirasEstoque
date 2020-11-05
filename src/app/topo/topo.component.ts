import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';
//services
import { CrudService } from '../shared/services/crud.service';
import { SearchService } from '../shared/services/search.service';
import { ProductService } from '../shared/services/product.service';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-topo',
  templateUrl: './topo.component.html',
  styleUrls: ['./topo.component.css']
})
export class TopoComponent implements OnInit {

  public subMenuTrougle = false;
  public ultimoIdProduto:String = null;
  public searchFilter:Array<object> = []

  public todosOsProdutosArray:Array<object> = [];
  public trougleMenuUser:boolean;

  constructor(public crud:CrudService,
              public searchServic:SearchService,
              public product:ProductService,
              public auth:AuthService
    ) { }

 async ngOnInit() {
   this.searchServic.mobileSearch.subscribe(res=>{this.searchProd(res);});

   this.auth.loginRealizado.subscribe(res=>{this.logoUserOneOff(true)});
   this.product.atualizaListProd.subscribe(res=>{
    this.todosOsProdutosArray = [];
      for(let key in res){
        res[key].id_prod = key
      this.todosOsProdutosArray.push(res[key]);
      }
     
   });
    await this.pegaProdutosAcopanhaAlteracosInDB();
    await this.verificaUsuarioLogado();

  }

  public verificaUsuarioLogado():void{
    if(localStorage.getItem('tokenId')){
      this.auth.autenticaUsuarioLogado(localStorage.getItem('tokenId'))
      .then(res=>{
        this.logoUserOneOff(true);
        this.trougleMenuUser = true;
      })
      .catch(err=>{
        this.trougleMenuUser = false;
        this.logoUserOneOff(false)
      })
    }else{
      this.trougleMenuUser = false;
      this.logoUserOneOff(false);
    }
  }

  public logoUserOneOff(online):void{
    const containerLogo = document.querySelector('#containerIconUser');
    const logo = document.querySelector('#logoUser');
    if(online){
      containerLogo.className = 'borderOn'
      logo['src'] = './assets/user/collaboratorOn.png';
      this.trougleMenuUser = true;
    }else{
      containerLogo.className = 'borderOff'
      logo['src'] = './assets/user/collaboratorOff.png';
      this.trougleMenuUser = false;
    }
  }

  public pegaProdutosAcopanhaAlteracosInDB():void{
    firebase.database().ref('/product')
        .on('value',res=>{
          let arayDb = res.val();
          for(let key in arayDb){
           arayDb[key].id_prod = key
           this.todosOsProdutosArray.push(arayDb[key]);
          }
      });
  }

  
  public trougleSubMenu():void{
    this.subMenuTrougle = this.subMenuTrougle === false ? true : false;
  }

  async searchProd(pesquisa){
   this.ultimoIdProduto = null;
   this.searchFilter = [];
   let palavrasSearch = (((pesquisa.value).trim()).toLowerCase()).split(' ');
    if(palavrasSearch[0] != ''){
      for(let key in this.todosOsProdutosArray){
        for(let key2 in palavrasSearch){
          this.todosOsProdutosArray[key]['tags']
          if((this.todosOsProdutosArray[key]['tags']).indexOf((palavrasSearch[key2]).toLowerCase()) !== -1){
            if(this.todosOsProdutosArray[key]['id_prod'] != this.ultimoIdProduto){
              this.searchFilter.push(this.todosOsProdutosArray[key]);
              if(this.ultimoIdProduto === null)this.ultimoIdProduto = this.todosOsProdutosArray[key]['id_prod'];
            }
          }
        } 
      }
    }
    this.searchServic.searchResult(this.searchFilter);
  } 

  sairUser():void{
    this.auth.logout()
    .then(res=>{
      this.logoUserOneOff(false);
      this.trougleMenuUser = false;
    })
    
  }

}
