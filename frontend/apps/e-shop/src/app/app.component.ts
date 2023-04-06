import { Component, OnInit } from '@angular/core';
import { UsersService } from '@lib/users';

@Component({
    selector: 'e-shop-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    constructor(private usersService: UsersService){}

    ngOnInit(): void {
        this.usersService.initAppSession();
    }
}
