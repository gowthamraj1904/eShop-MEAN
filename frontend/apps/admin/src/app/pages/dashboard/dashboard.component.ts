import { Component, OnDestroy, OnInit } from '@angular/core';
import { OrdersService } from '@lib/orders';
import { ProductsService } from '@lib/products';
import { UsersService } from '@lib/users';
import { combineLatest, Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
    statistics: number[] = [];

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private userService: UsersService,
        private productService: ProductsService,
        private ordersService: OrdersService
    ) {}

    private getStatistics(): void {
        combineLatest([
            this.ordersService.getOrdersCount(),
            this.productService.getProductsCount(),
            this.userService.getUsersCount(),
            this.ordersService.getTotalSales()
        ])
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((values: number[]) => {
                this.statistics = values;
            });
    }

    ngOnInit(): void {
        this.getStatistics();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
