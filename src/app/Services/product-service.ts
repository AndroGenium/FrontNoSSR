import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../Interfaces/inter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiProductUrl = 'https://localhost:7244/api/Product';

  constructor(private http: HttpClient) { }

  // Get all products (no filters)
  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiProductUrl}/get-products`);
  }

  // Get filtered products
  getFilteredProducts(
    category: string | null, 
    isAvailable: boolean | null, 
    sortBy: string | null
  ): Observable<Product[]> {
    let params = new HttpParams();

    if (category) {
      params = params.set('category', category);
    }

    if (isAvailable !== null) {
      params = params.set('isAvailable', isAvailable.toString());
    }

    if (sortBy) {
      params = params.set('sortBy', sortBy);
    }

    return this.http.get<Product[]>(`${this.apiProductUrl}/get-filtered-products`, { params });
  }

  search(query: string): Observable<any[]> {
    const params = new HttpParams().set('q', query); // MUST match backend
    return this.http.get<any[]>(`${this.apiProductUrl}/search`, { params });
  }

}