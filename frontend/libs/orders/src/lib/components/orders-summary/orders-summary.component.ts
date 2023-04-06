import { Component, OnDestroy, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { OrdersService } from '../../services/orders.service';
import { Subject, take, takeUntil } from 'rxjs';
import { Router } from '@angular/router';

@Component({
    selector: 'orders-summary',
    templateUrl: './orders-summary.component.html',
    styleUrls: ['./orders-summary.component.scss']
})
export class OrdersSummaryComponent implements OnInit, OnDestroy {
    totalPrice = 0;

    isCheckout = false;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private router: Router,
        private cartService: CartService,
        private ordersService: OrdersService
    ) {
        this.isCheckout = this.router.url.includes('checkout') ? true : false;
    }

    private getOrderSummary(): void {
        this.cartService.cart$
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((cart) => {
                this.totalPrice = 0;

                if (cart) {
                    cart.items?.map((item) => {
                        this.ordersService
                            .getProductById(item.productId as string)
                            .pipe(take(1))
                            .subscribe((product) => {
                                this.totalPrice +=
                                    product.price * (item.quantity as number);
                            });
                    });
                }
            });
    }

    navigateToCheckout(): void {
        this.router.navigate(['/checkout']);
    }

    ngOnInit(): void {
        this.getOrderSummary();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
