import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Category } from '../models/category.model';
import { environment } from '@env/environment';

@Injectable()
export class CategoriesService {
    apiUrl = `${environment.apiUrl}/categories`;

    constructor(private http: HttpClient) {}

    getCategories(): Observable<Category[]> {
        return this.http.get<Category[]>(this.apiUrl);
    }

    getCategoryById(categoryId: string): Observable<Category> {
        return this.http.get<Category>(`${this.apiUrl}/${categoryId}`);
    }

    createCategories(category: Category): Observable<Category> {
        return this.http.post<Category>(this.apiUrl, category);
    }
    updateCategory(category: Category): Observable<Category> {
        return this.http.put<Category>(
            `${this.apiUrl}/${category.id}`,
            category
        );
    }

    deleteCategory(categoryId: string): Observable<Record<string, string>> {
        return this.http.delete<Record<string, string>>(
            `${this.apiUrl}/${categoryId}`
        );
    }
}
