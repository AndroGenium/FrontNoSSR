import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './Pages/login/login';
import { AccountCreation } from './Pages/account-creation/account-creation';
import { HomePage } from './Pages/home-page/home-page';

const routes: Routes = [

  {
    path: '',
    component: HomePage
  },

  {
    path: 'Signup',
    component: AccountCreation
  },

  {
    path: 'Login',
    component: Login
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
