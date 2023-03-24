import { Injectable } from '@angular/core';

const TOKEN = 'jwtToken';

@Injectable()
export class LocalstorageService {
    setToken(data: any): void {
        localStorage.setItem(TOKEN, data);
    }

    getToken(): string | null {
        return localStorage.getItem(TOKEN);
    }

    removeToken(): void {
        localStorage.removeItem(TOKEN);
    }
}
