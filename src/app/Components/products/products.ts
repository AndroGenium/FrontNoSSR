import { LocalUserService } from './../../Services/local-user-service';
import { Product, User } from './../../Interfaces/inter';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { UserService } from '../../Services/user-service';
import { Inter } from '../../Interfaces/inter';
import { ProductService } from '../../Services/product-service';
import { lastValueFrom, Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {

  user$!: Observable<User | null>;
  constructor(private localUserService: LocalUserService, private productService: ProductService){ 
    this.user$ = localUserService.user$
  }

  // products array obv
  productsArray: Product[] = [];
  //
  
  ngOnInit(): void {

    //loads products
    this.loadProducts();
    //
  }
  private loadProducts(){
    this.productService.getProducts().subscribe(response => {
      this.productsArray = response;
      console.log(this.productsArray)
    });
  }
}
