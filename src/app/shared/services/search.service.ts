import { Injectable, EventEmitter } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {
  
  public searchEvent = new EventEmitter();
  public dadosProdutoAtivoNow = new EventEmitter();
  public mobileSearch = new EventEmitter();

  constructor() { }

  public searchResult(produtosSearch:Array<object>):void{
    this.searchEvent.emit(produtosSearch);
  }

  public ativarBotoesAddeDel(dadosProd):void{
    this.dadosProdutoAtivoNow.emit(dadosProd);
  }

  public searchInMobile(pesquisa):void{
      this.mobileSearch.emit(pesquisa);
  }

}
