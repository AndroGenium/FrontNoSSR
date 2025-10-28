import { Product } from './../../Interfaces/inter';
import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { UserService } from '../../Services/user-service';
import { Inter } from '../../Interfaces/inter';
import { ProductService } from '../../Services/product-service';
import { lastValueFrom } from 'rxjs';
@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {

  constructor(private userService: UserService, private productService: ProductService) {}

  productsArray: Product[] = [];


  ngOnInit(){
    this.userService.loadUserRole();
    this.loadProducts();
  }


  private loadProducts(){
    this.productService.getProducts().subscribe(response => {
      this.productsArray = response;
      console.log(this.productsArray)
    });
  }
  //    
  //LOADS ENUM of userrole- admin user or guest

   get isGuest() {
    return this.userService.isGuest();
  }
}
