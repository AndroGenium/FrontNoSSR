import { Component } from '@angular/core';

@Component({
  selector: 'app-account-creation',
  standalone: false,
  templateUrl: './account-creation.html',
  styleUrl: './account-creation.scss',
})
export class AccountCreation {

  CheckTerms(){
    const termsCheckbox = document.getElementById('termsCheckbox') as HTMLInputElement;
    const createAccountButton = document.getElementById('createAccountButton') as HTMLButtonElement;
  }

}
