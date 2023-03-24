import { Component } from '@angular/core';
import { AuthService } from '@lib/users';

@Component({
    selector: 'admin-side-bar',
    templateUrl: './side-bar.component.html',
    styleUrls: ['./side-bar.component.scss']
})
export class SideBarComponent {
    constructor(private authService: AuthService) {}

    onLogout(): void {
        this.authService.logout();
    }
}
