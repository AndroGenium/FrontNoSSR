import { LocalUserService } from './../../Services/local-user-service';
import { Product, User } from './../../Interfaces/inter';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../Services/product-service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-products',
  standalone: false,
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {

  user$!: Observable<User | null>;
  productsArray: Product[] = [];
  loading: boolean = false;

  // Filter states
  selectedCategory: string = '';
  selectedAvailability: string = '';
  selectedSort: string = '';

  constructor(
    private localUserService: LocalUserService, 
    private productService: ProductService
  ) { 
    this.user$ = localUserService.user$;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // Load products with filters
  private loadProducts(): void {
    this.loading = true;

    // Convert filter values
    const category = this.selectedCategory || null;
    const isAvailable = this.selectedAvailability 
      ? this.selectedAvailability === 'true' 
      : null;
    const sortBy = this.selectedSort || null;

    this.productService.getFilteredProducts(category, isAvailable, sortBy)
      .subscribe({
        next: (response) => {
          this.productsArray = response;
          console.log('✅ Loaded products:', this.productsArray);
          this.loading = false;
        },
        error: (error) => {
          console.error('❌ Failed to load products:', error);
          this.loading = false;
        }
      });
  }

  // Handle category filter change
  onCategoryChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedCategory = select.value;
    this.loadProducts();
  }

  // Handle availability filter change
  onAvailabilityChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedAvailability = select.value;
    this.loadProducts();
  }

  // Handle sort change
  onSortChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.selectedSort = select.value;
    this.loadProducts();
  }

  // Reset filters
  resetFilters(): void {
    this.selectedCategory = '';
    this.selectedAvailability = '';
    this.selectedSort = '';
    this.loadProducts();
  }
}