import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Subject, takeUntil } from 'rxjs';
import { CartItemDetailed, OrdersService } from '@lib/orders';

@Component({
    selector: 'orders-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit, OnDestroy {
    cartItemDetailed: CartItemDetailed[] = [];

    cartCount = 0;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private router: Router,
        private cartService: CartService,
        private ordersService: OrdersService
    ) {}

    backToShop(): void {
        this.router.navigate(['/products']);
    }

    deleteCartItem(cartItem: CartItemDetailed): void {
        this.cartService.deleteCartItem(cartItem.product.id);
    }

    onQuantityChange(event: any, cartItem: CartItemDetailed): void {
        this.cartService.setCartItem(
            {
                productId: cartItem.product.id,
                quantity: event.value
            },
            true
        );
    }

    private getCartDetails(): void {
        this.cartService.cart$
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((response: any) => {
                this.cartItemDetailed = [];
                this.cartCount = response?.items?.length ?? 0;

                response.items.forEach((item: any) => {
                    this.ordersService
                        .getProductById(item.productId)
                        .subscribe((product) => {
                            this.cartItemDetailed.push({
                                product,
                                quantity: item.quantity
                            });
                        });
                });
            });
    }

    ngOnInit(): void {
        this.getCartDetails();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
