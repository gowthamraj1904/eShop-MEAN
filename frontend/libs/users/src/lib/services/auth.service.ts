import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
import { User } from '../models/users.model';
import { LocalstorageService } from './localstorage.service';

@Injectable()
export class AuthService {
    apiUrl = `${environment.apiUrl}/users`;

    constructor(
        private http: HttpClient,
        private localstorageService: LocalstorageService,
        private router: Router
    ) {}

    login(
        email: string,
        password: string
    ): Observable<{ user: string; token: string }> {
        return this.http.post<{ user: string; token: string }>(
            `${this.apiUrl}/login`,
            {
                email,
                password
            }
        );
    }

    logout(): void {
        this.localstorageService.removeToken();
        this.router.navigate(['/login']);
    }
}
