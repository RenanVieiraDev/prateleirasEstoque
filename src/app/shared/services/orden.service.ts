import { Injectable } from '@angular/core';
//serviços de gerador depdf
import  jsPDF  from "jspdf";

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  constructor() { }

  validaCanpos(dados):Promise<any>{
    return new Promise((resolve,reject)=>{
      if(!this.validaOrdenServico(dados.ordemServico))reject('Orden de serviço invalida!');
      if(!this.validaQuantidadePlanos(dados.qPlanos))reject('Quantidade Planos invalida!');
      if(!this.validaQuantidadeAfinacao(dados.qAfinacao))reject('Quantidade Afinação invalida!');
      if(!this.validaTamanhoCorte(dados.tamanhoCorte))reject('Tamanho do corte invalida!');
      if(!this.validaTipoPapel(dados.tipoPapel))reject('Tipo do papel invalido!');
      if(!this.validaTamanhoPapel(dados.tamanhoPapel))reject('Tamanho do papel é invalido!');
      if(!this.validaQuantidadeRetirada(dados.quantidadeRetirar))reject('Informe uma quantidade valida para retirar!');
      resolve('ok');
    });
  }

  validaOrdenServico(valor):boolean{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return false;
    if(valor==='')return false;
    return true;
  }

  validaQuantidadePlanos(valor):boolean{
    if(valor === null)return false;
    if(typeof valor !== "number")return false;
    if(valor < 0)return false;
    return true;
  }

  validaQuantidadeAfinacao(valor):boolean{
    if(valor === null)return false;
    if(typeof valor !== "number")return false;
    if(valor < 0)return false;
    return true;
  }

  validaTamanhoCorte(valor):boolean{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return false;
    if(valor==='')return false;
    return true;
  }

  validaTipoPapel(valor):boolean{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return false;
    if(valor==='')return false;
    return true;
  }

  validaTamanhoPapel(valor):boolean{
    if(valor !== null)valor = valor.trim();
    if(valor === null)return false;
    if(valor==='')return false;
    return true;
  }

  validaQuantidadeRetirada(valor):boolean{
    if(valor === null)return false;
    if(typeof valor !== "number")return false;
    if(valor <= 0)return false;
    return true;
  }

  imprimeOrden(dados):void{
    const dia = new Date().getDate();
    const mes = new Date().getMonth()+1;
    const ano = new Date().getFullYear();
    const hora = new Date().getHours();
    const minutos = new Date().getMinutes();

    let documento = new jsPDF();
    
    documento.setFillColor(50,50,50);
    documento.rect(10, 20, 100, 70, "FD");

    documento.setTextColor(255, 255, 255);
    
    //data e hora
    documento.setFontSize(9);
    documento.text("O.S de estoque", 35, 23);
    documento.setFontSize(8);
    documento.setTextColor(255,50,50);
    documento.text(dados.id_orden, 70, 23);
    
    //ordem serviço
    documento.setTextColor(255, 255, 255);
    documento.setFontSize(10);
    documento.text("O.S:", 12, 30);
    documento.setTextColor(255,50,50);
    documento.text(dados.ordemServico, 20, 30);
    
    documento.setFontSize(10); //tamanho de fonte

     //Q.Planos 
     documento.setTextColor(255, 255, 255);
     documento.text("Q.Planos:", 12, 37);
     documento.setTextColor(255,50,50);
     documento.text(`${dados.qPlanos}`, 28, 37);

     //Q.Afinação
     documento.setTextColor(255, 255, 255);
     documento.text("Q.Afinação:", 12, 44);
     documento.setTextColor(255,50,50);
     documento.text(`${dados.qAfinacao}`, 31, 44);

     //T.Corte
     documento.setTextColor(255, 255, 255);
     documento.text("T.Corte:", 12, 51);
     documento.setTextColor(255,50,50);
     documento.text(`${dados.tamanhoCorte}`, 26, 51);

     //Tipo
     documento.setTextColor(255, 255, 255);
     documento.text("Tipo:", 12, 58);
     documento.setTextColor(255,50,50);
     documento.text(`${dados.tipoPapel}`, 21, 58);

     //Tamanho
     documento.setTextColor(255, 255, 255);
     documento.text("Tamanho:", 12, 65);
     documento.setTextColor(255,50,50);
     documento.text(`${dados.tamanhoPapel}`, 29, 65);

     //Quantidade usada
     documento.setTextColor(255, 255, 255);
     documento.text("Q.Retiradas:", 12, 72);
     documento.setTextColor(255,50,50);
     documento.text(`${dados.quantidadeRetirar}`, 33, 72);

     //Retirada confirmada
     documento.setTextColor(255, 255, 255);
     documento.text("Retirada Comfirmada:", 12, 79);
     documento.setTextColor(255,50,50);
     documento.text(`${dados.retirada}`, 47, 79);

     documento.setDrawColor(255, 255, 255);
     documento.line(10, 85, 110, 85);

     documento.setTextColor(255,50,50);
     documento.text(`${dados.admEmail}`, 11, 89);

     //data e hora
    documento.setFontSize(9);
    documento.text(`${dia}/${mes}/${ano}`, 81, 89);
    documento.text(`às ${hora}:${minutos}`, 97, 89);
    
    documento.output("dataurlnewwindow");
  }

  imprimeOrdenAcrescimo(dados):void{
    const dia = new Date().getDate();
    const mes = new Date().getMonth()+1;
    const ano = new Date().getFullYear();
    const hora = new Date().getHours();
    const minutos = new Date().getMinutes();

    let documento = new jsPDF();
    
    documento.setFillColor(50,50,50);
    documento.rect(10, 20, 100, 70, "FD");

    documento.setTextColor(255, 255, 255);
    
    //data e hora
    documento.setFontSize(9);
    documento.text("O.S de estoque", 35, 23);
    documento.setFontSize(8);
    documento.setTextColor(0,128,0);
    documento.text(dados.id_orden, 70, 23);
    
    //ordem serviço
    documento.setTextColor(255, 255, 255);
    documento.setFontSize(10);
    documento.text("O.S:", 12, 30);
    documento.setTextColor(0,128,0);
    documento.text(dados.ordemServico, 20, 30);
    
    documento.setFontSize(10); //tamanho de fonte

     //Q.Planos 
     documento.setTextColor(255, 255, 255);
     documento.text("Nome:", 12, 37);
     documento.setTextColor(0,128,0);
     documento.text(`${dados.nomePapel}`, 23, 37);

     //Q.Afinação
     documento.setTextColor(255, 255, 255);
     documento.text("gramagem:", 12, 44);
     documento.setTextColor(0,128,0);
     documento.text(`${dados.gramagem}`, 31, 44);

     //T.Corte
     documento.setTextColor(255, 255, 255);
     documento.text("Tipo:", 12, 51);
     documento.setTextColor(0,128,0);
     documento.text(`${dados.tipoPapel}`, 21, 51);

     //Tipo
     documento.setTextColor(255, 255, 255);
     documento.text("Tamanho:", 12, 58);
     documento.setTextColor(0,128,0);
     documento.text(`${dados.tamanhoPapel}`, 29, 58);

     //Tamanho
     documento.setTextColor(255, 255, 255);
     documento.text("Fornecedor:", 12, 65);
     documento.setTextColor(0,128,0);
     documento.text(`${dados.fornecedor}`, 32, 65);

     //Quantidade usada
     documento.setTextColor(255, 255, 255);
     documento.text("Q.Acrescentada:", 12, 72);
     documento.setTextColor(0,128,0);
     documento.text(`${dados.quantidadeAcrescentada}`, 39, 72);

     //Retirada confirmada
     documento.setTextColor(255, 255, 255);
     documento.text("Retirada Comfirmada:", 12, 79);
     documento.setTextColor(0,128,0);
     documento.text(`${dados.retirada}`, 47, 79);

     documento.setDrawColor(255, 255, 255);
     documento.line(10, 85, 110, 85);

     documento.setTextColor(0,128,0);
     documento.text(`${dados.admEmail}`, 11, 89);

     //data e hora
    documento.setFontSize(9);
    documento.text(`${dia}/${mes}/${ano}`, 81, 89);
    documento.text(`às ${hora}:${minutos}`, 97, 89);
    
    documento.output("dataurlnewwindow");
  }


}
