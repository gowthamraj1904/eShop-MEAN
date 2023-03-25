import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { Login } from '../models/login.model';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthService {
    apiUrl = `${environment.apiUrl}/users`;

    constructor(
        private http: HttpClient,
        private localStorageService: LocalStorageService,
        private router: Router
    ) {}

    login(email: string, password: string): Observable<Login> {
        return this.http.post<Login>(`${this.apiUrl}/login`, {
            email,
            password
        });
    }

    logout(): void {
        this.localStorageService.removeToken();
        this.router.navigate(['/login']);
    }
}
