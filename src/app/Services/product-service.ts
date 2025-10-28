import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Inter, Product } from '../Interfaces/inter';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private apiProductUrl = 'http://localhost:7244/api/Product';

  constructor(private http: HttpClient) { }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiProductUrl}/get-products`);
  }
  
}
