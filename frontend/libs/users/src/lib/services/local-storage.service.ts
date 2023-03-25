import { Injectable } from '@angular/core';

const TOKEN = 'jwtToken';

@Injectable()
export class LocalStorageService {
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
