import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

//conponents
import { HomeComponent } from './home/home.component';
import { AddProdutoComponent } from './configuracoes/add-produto/add-produto.component';
import { ConfPrateleiraComponent } from './configuracoes/conf-prateleira/conf-prateleira.component'
import { LoginComponent } from './login/login.component';
import { ConfFuncionarioComponent } from './configuracoes/conf-funcionario/conf-funcionario.component';
import { RmProdutoComponent } from './configuracoes/rm-produto/rm-produto.component';

const routes: Routes = [
  {path:'',component:HomeComponent},
  {path:'addProduto',component:AddProdutoComponent},
  {path:'confPrateleiras',component:ConfPrateleiraComponent},
  {path:'login',component:LoginComponent},
  {path:'confFuncionario',component:ConfFuncionarioComponent},
  {path:'rmProduto',component:RmProdutoComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
