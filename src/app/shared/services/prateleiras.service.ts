import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class PrateleirasService {

  constructor(
    public crud:CrudService
  ) { }

  public validaDadosConfPrateleiras(dados):Promise<any>{
    return new Promise(async (resolve,reject)=>{
  
      //total prateleiras
      let totPrateleiras = this.validaTotalPrateleiras(dados.prateleiras);
      if( totPrateleiras != 'ok'){reject(totPrateleiras)};
      
      //total de andares
      let totAndares = this.validaTotalAndares(dados.andares);
      if( totAndares != 'ok'){reject(totAndares)};
      resolve('ok');
    });
  }

  public validaTotalPrateleiras(valor):String{
    if(valor === null)return 'Informe a quantidade de prateleiras!';
    if(typeof valor !== "number")return 'Valor de prateleiras incorreto!';
    if(valor <= 0)return 'Informe uma quantidade de prateleiras superior a 0 !';
    if(valor > 23)return 'Desculpe mais o total de prateleiras não pode passar de 23!';
    return 'ok';
  }

  public validaTotalAndares(valor):String{
    if(valor === null)return 'Informe a quantidade de andares que as prateleiras iram conter!';
    if(typeof valor !== "number")return 'Valor de andares incorreto!';
    if(valor <= 0)return 'Informe uma quantidade de andares superior a 0 !';
    return 'ok';
  }

  public async alteraValorQuantidadeProdutoEmPrateleira(path,valor){
    await this.crud.atualizaValorNoDb(
      `configPrateleiras/esquemaPrateleiras/${path.prateleira}/andares/${path.andar}/espacos/${path.espaco}/descProduto/${0}/quantidadePapel/`
      ,valor
    );
  }

  public async removeProdutoEmPrateleira(path){
    await this.crud.atualizaValorNoDb(
      `configPrateleiras/esquemaPrateleiras/${path.prateleira}/andares/${path.andar}/espacos/${path.espaco}/quantidadeProdutoArmazenado/`
      ,0
    );
    await this.crud.atualizaValorNoDb(
      `configPrateleiras/esquemaPrateleiras/${path.prateleira}/andares/${path.andar}/espacos/${path.espaco}/descProduto/`
      ,[]
    );
  }

  public validaTotalAcrescimoPrat(dado):Promise<any>{
    return new Promise((resolve,reject)=>{
      if(!this.validaValorAcrescimo(dado.valorInpt))reject('Valor invalido! Informe um valor superior a 0');
      if(!this.validaMaxPrat(dado.totPrat))reject('Total maximo de prateleiras atingida!');
      resolve('ok');
    });
  }

  public validaValorAcrescimo(valor):boolean{
    if(isNaN(valor))return false;
    if(valor === null)return false;
    if(typeof valor !== "number")return false;
    if(valor <= 0)return false;
    return true;
  }

  public validaMaxPrat(valor):boolean{
    if(valor === null)return false;
    if(typeof valor !== "number")return false;
    if(valor >= 23)return false;
    return true;
  }


}
