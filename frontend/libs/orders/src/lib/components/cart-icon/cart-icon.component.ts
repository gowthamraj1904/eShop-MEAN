import { Component, OnInit } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { Cart } from '@lib/orders';

@Component({
    selector: 'orders-cart-icon',
    templateUrl: './cart-icon.component.html',
    styleUrls: ['./cart-icon.component.scss']
})
export class CartIconComponent implements OnInit {
    cartCount = 0;

    constructor(private cartService: CartService) {}

    getCart(): void {
        this.cartService.cart$.subscribe((cart: Cart) => {
            this.cartCount = cart.items?.length ?? 0;
        });
    }

    ngOnInit(): void {
        this.getCart();
    }
}
