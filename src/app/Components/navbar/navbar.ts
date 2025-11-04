

import { Component, OnInit, OnDestroy } from '@angular/core';
import { LocalUserService } from '../../Services/local-user-service';
import { Observable, Subscription } from 'rxjs';
import { User } from '../../Interfaces/inter';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit{
  
  user$!: Observable<User | null>;
  constructor(private localUserService: LocalUserService){
    this.user$ = localUserService.user$
  }

  
  

  ngOnInit(): void {
    this.localUserService.user$.subscribe(user => {
      console.log("Current User From Navbar:", user)
    });
  }
  

}
