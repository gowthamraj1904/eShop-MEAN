import { inject } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot
} from '@angular/router';
import { LocalStorageService } from './local-storage.service';

export const AuthGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
) => {
    const router = inject(Router);
    const localStorageService = inject(LocalStorageService);
    const token = localStorageService.getToken();

    const isTokenExpired = (expiration: number) => {
        return Math.floor(new Date().getTime() / 1000) >= expiration;
    };

    if (token) {
        const tokenDecode = JSON.parse(atob(token.split('.')[1]));

        if (tokenDecode.isAdmin && !isTokenExpired(tokenDecode.exp)) {
            return true;
        }
    }

    router.navigate(['/login']);
    return false;
};
