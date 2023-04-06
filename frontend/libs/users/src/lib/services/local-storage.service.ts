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

    private isTokenExpired = (expiration: number) => {
        return Math.floor(new Date().getTime() / 1000) >= expiration;
    };

    isValidToken(): boolean {
        const token = this.getToken();

        if (token) {
            const tokenDecode = JSON.parse(atob(token.split('.')[1]));

            return !this.isTokenExpired(tokenDecode.exp);
        }

        return false;
    }

    getUserIdFromToken(): string {
        const token = this.getToken();

        if (token) {
            const tokenDecode = JSON.parse(atob(token.split('.')[1]));

            return tokenDecode ? tokenDecode.userId : '';
        }

        return '';
    }
}
