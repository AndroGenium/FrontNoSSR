import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from '../../Interfaces/inter';
import { ProductService } from '../../Services/product-service';

@Component({
  selector: 'app-product-page',
  standalone: false,
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})
export class ProductPage implements OnInit {
  product: Product | null = null;
  selectedImage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    const productId = this.route.snapshot.queryParams['id'];
    if (productId) {
      this.productService.getProducts().subscribe((products) => {
        this.product = products.find(p => p.id == productId) || null;
      });
    }
  }

  selectImage(img: string) {
    this.selectedImage = img;
  }

  get getStars(){
    if(this.product?.avarageRating != null){
      return Math.round(this.product.avarageRating)
    }
    else{
      return 4;
    }
  }

  // Source - https://stackoverflow.com/a
// Posted by Pankaj Parkar, modified by community. See post 'Timeline' for change history
// Retrieved 2025-11-27, License - CC BY-SA 4.0

    createRange(number: number){
      // return new Array(number);
      return new Array(number).fill(0)
        .map((n, index) => index + 1);
    }

}
