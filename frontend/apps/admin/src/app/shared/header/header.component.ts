import { Component, OnInit } from '@angular/core';
import { AuthService } from '@lib/users';
import { LocalStorageService } from '@lib/users';

@Component({
    selector: 'admin-header',
    templateUrl: './header.component.html',
    styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    user: {name: string, email: string};

    constructor(
        private authService: AuthService,
        private localStorageService: LocalStorageService
    ) {}

    private getUserDetails(): void {
        const token = this.localStorageService.getToken();

        if (token) {
            const tokenDecode = JSON.parse(atob(token.split('.')[1]));
            this.user = {
                email: tokenDecode.email,
                name: tokenDecode.userName
            };
        }
    }

    onLogout(): void {
        this.authService.logout();
    }

    ngOnInit(): void {
        this.getUserDetails();
    }
}
