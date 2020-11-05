import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TopoComponent } from './topo/topo.component';
import { RodapeComponent } from './rodape/rodape.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

//components
import { AddProdutoComponent } from './configuracoes/add-produto/add-produto.component';
import { ConfPrateleiraComponent } from './configuracoes/conf-prateleira/conf-prateleira.component';

//services
import { PrateleirasService } from './shared/services/prateleiras.service';
import { ProductService } from './shared/services/product.service';
import { SearchService } from './shared/services/search.service';
import { AuthService } from './shared/services/auth.service';
import { LoginComponent } from './login/login.component';
import { ConfFuncionarioComponent } from './configuracoes/conf-funcionario/conf-funcionario.component';
import { CadastroFuncionarioComponent } from './configuracoes/conf-funcionario/cadastro-funcionario/cadastro-funcionario.component';
import { FuncionarioService } from './shared/services/funcionario.service';
import { OrdenService } from './shared/services/orden.service';
import { RmProdutoComponent } from './configuracoes/rm-produto/rm-produto.component';

@NgModule({
  declarations: [
    AppComponent,
    TopoComponent,
    RodapeComponent,
    HomeComponent,
    AddProdutoComponent,
    ConfPrateleiraComponent,
    LoginComponent,
    ConfFuncionarioComponent,
    CadastroFuncionarioComponent,
    RmProdutoComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    PrateleirasService,
    ProductService,
    SearchService,
    AuthService,
    FuncionarioService,
    OrdenService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
