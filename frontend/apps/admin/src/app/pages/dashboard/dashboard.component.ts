import { Component, OnInit } from '@angular/core';
import { OrdersService } from '@lib/orders';
import { ProductsService } from '@lib/products';
import { UsersService } from '@lib/users';
import { combineLatest } from 'rxjs';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
    statistics: number[] = [];

    constructor(
        private userService: UsersService,
        private productService: ProductsService,
        private ordersService: OrdersService
    ) {}

    ngOnInit(): void {
        combineLatest([
            this.ordersService.getOrdersCount(),
            this.productService.getProductsCount(),
            this.userService.getUsersCount(),
            this.ordersService.getTotalSales()
        ]).subscribe((values: number[]) => {
            this.statistics = values;
        });
    }
}
