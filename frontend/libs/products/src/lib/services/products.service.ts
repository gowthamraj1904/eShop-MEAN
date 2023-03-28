import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { Product } from '../models/product.model';

@Injectable()
export class ProductsService {
    apiUrl = `${environment.apiUrl}/products`;

    constructor(private http: HttpClient) {}

    getProducts(): Observable<Product[]> {
        return this.http.get<Product[]>(this.apiUrl);
    }

    getProductById(productId: string): Observable<Product> {
        return this.http.get<Product>(`${this.apiUrl}/${productId}`);
    }

    createProducts(productFormData: FormData): Observable<Product> {
        return this.http.post<Product>(this.apiUrl, productFormData);
    }

    updateProduct(
        productFormData: FormData,
        productId: string
    ): Observable<Product> {
        return this.http.put<Product>(
            `${this.apiUrl}/${productId}`,
            productFormData
        );
    }

    deleteProduct(productId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${productId}`);
    }

    getProductsCount(): Observable<number> {
        return this.http
            .get<number>(`${this.apiUrl}/get/count`)
            .pipe(map((objectValue: any) => objectValue.productsCount));
    }

    getFeaturedProducts(count: number): Observable<Product[]> {
        return this.http.get<Product[]>(`${this.apiUrl}/get/featured/${count}`);
    }
}
