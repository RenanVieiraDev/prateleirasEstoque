import { Injectable, EventEmitter } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  public atualizaListProd = new EventEmitter();
  public atualizaPrateleiras = new EventEmitter();


  constructor(
    public crud:CrudService
  ) { }

  public validaCampoParaAcrescimoUN(dados):Promise<any>{
    return new Promise(async (resolve,reject)=>{
      let resValidaQuantidadePapel = await this.validaQuantidadeDoPapel(dados.quantidadeUN)
      if( resValidaQuantidadePapel != 'ok'){reject(resValidaQuantidadePapel)};
      resolve('ok')
    });
  }

  public validaQuantidadeUN(valor):string{
    if(valor === null)return 'Informe a quantidade valida!';
    if(typeof valor !== "number")return 'Propriedade da quantidade é incorreta!';
    if(valor <= 0)return 'Informe uma quantidade superior a 0 !';
    return 'ok';
  }



  public validaDadosProdutoParaSalvarInDB(dadosProduto):Promise<any>{
    return new Promise<any>(async (resolve,reject)=>{
      //tipo do papel
      let resValidaTipoPapel = await this.validaCampoTipoPapel(dadosProduto.tipoPapel)
      if( resValidaTipoPapel != 'ok'){reject(resValidaTipoPapel)};
      //nome do papel
      let resValidaNomePapel = await this.validaNomeDoPapel(dadosProduto.nomePapel)
      if( resValidaNomePapel != 'ok'){reject(resValidaNomePapel)};
      //gramagem do papel
      let resValidaGramagemPapel = await this.validaGramagemDoPapel(dadosProduto.gramagemPapel)
      if( resValidaGramagemPapel != 'ok'){reject(resValidaGramagemPapel)};
      //tamanho do papel
      let resValidaTamanhoPapel = await this.validaTamanhoDoPapel(dadosProduto.tamanhoPapel)
      if( resValidaTamanhoPapel != 'ok'){reject(resValidaTamanhoPapel)};
      //fornecedor do papel
      let resValidafornecedorPapel = await this.validaFornecedorDoPapel(dadosProduto.fornecedorPapel)
      if( resValidafornecedorPapel != 'ok'){reject(resValidafornecedorPapel)};
      //quantidade do papel
      let resValidaQuantidadePapel = await this.validaQuantidadeDoPapel(dadosProduto.quantidadePapel)
      if( resValidaQuantidadePapel != 'ok'){reject(resValidaQuantidadePapel)};
      //local armazenagem do papel
      let resValidaLocalPapel = await this.validaLocalDoPapel(dadosProduto.localPapel)
      if( resValidaLocalPapel != 'ok'){reject(resValidaLocalPapel)};
      resolve('ok')
    });
  }

  public validaCampoTipoPapel(valor):String{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return 'Informe o tipo do papel!';
    if(valor === '')return 'Valor tipo do papel é invalido!';
    return 'ok';
  }

  public validaNomeDoPapel(valor):string{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return 'Informe o nome do papel!';
    if(valor === '')return 'Valor nome do papel é invalido!';
    if(valor.length < 2)return 'Nome papel muito curto!';
    return 'ok';
  }

  public validaGramagemDoPapel(valor):string{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return 'Informe a gramagem do papel!';
    if(valor === '')return 'Valor gramagem do papel é invalido!';
    return 'ok';
  }

  public validaTamanhoDoPapel(valor):string{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return 'Informe o tamanho do papel!';
    if(valor === '')return 'Valor tamanho do papel é invalido!';
    return 'ok';
  }

  public validaFornecedorDoPapel(valor):string{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return 'Informe o fornecedor do papel!';
    if(valor === '')return 'O fornecedor do papel é invalido!';
    return 'ok';
  }

  public validaQuantidadeDoPapel(valor):string{
    if(valor === null)return 'Informe a quantidade do papel!';
    if(typeof valor !== "number")return 'Propriedade da quantidade é incorreta!';
    if(valor <= 0)return 'Informe uma quantidade superior a 0 !';
    return 'ok';
  }

  public validaLocalDoPapel(valor):string{
    if(valor === null)return 'Informe o local de armazenagem do papel!';
    return 'ok';
  }

  public async atualizaQuantidadeProduto(id_prod,quantidadeModificar){
    const valorAtual = await this.crud.pegaValorNoDb(`product/${id_prod}/quantidadePapel/`) 
    let totalAtual = (valorAtual-quantidadeModificar);
    if(totalAtual >= 0){
      await this.crud.atualizaValorNoDb(`product/${id_prod}/quantidadePapel/`,totalAtual);
      return totalAtual;
    }else{
      return totalAtual;
    }
  }

  public async acrescentaUNProd(id_prod,quantidadeModificar){
    const valorAtual = await this.crud.pegaValorNoDb(`product/${id_prod}/quantidadePapel/`);
    let totalAtual = (valorAtual+quantidadeModificar);
    await this.crud.atualizaValorNoDb(`product/${id_prod}/quantidadePapel/`,totalAtual);
    return totalAtual;
  }

  public atualizaListaDeProdutos():void{
    this.crud.pegaValorNoDb(`product/`)
    .then(res=>{
      this.atualizaListProd.emit(res);
    })
    .catch(err=>{})
  }

  public atualizaPrateleirasDeProdutosHome():void{
    this.atualizaPrateleiras.emit(true);
  }
  


}
