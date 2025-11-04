import { NgModule, provideBrowserGlobalErrorListeners } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing-module';
import { App } from './app';
import { Footer } from './Components/footer/footer';
import { Navbar } from './Components/navbar/navbar';
import { Products } from './Components/products/products';
import { AccountCreation } from './Pages/account-creation/account-creation';
import { HomePage } from './Pages/home-page/home-page';
import { Login } from './Pages/login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { VerifyEmailPage } from './Pages/verify-email-page/verify-email-page';

@NgModule({
  declarations: [
    App,
    Footer,
    Navbar,
    Products,
    AccountCreation,
    HomePage,
    Login,
    VerifyEmailPage
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideBrowserGlobalErrorListeners()
  ],
  bootstrap: [App]
})
export class AppModule { }
