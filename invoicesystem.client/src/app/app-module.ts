import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { App } from './app';
import { NavbarComponent } from './shared/components/navbar.component';
import { HomeComponent } from './pages/home/home.component';
import { CustomersComponent } from './pages/customers/customers.component';
import { AppRoutingModule } from './app-routing-module';
import { CustomerService } from './services/customer.service';

@NgModule({
  declarations: [
    App,
    NavbarComponent,
    HomeComponent,
    CustomersComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [CustomerService],
  bootstrap: [App]
})
export class AppModule { }
