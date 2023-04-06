import { Component, Input } from '@angular/core';
import { Product } from '../../models/product.model';
import { CartItem, CartService } from '@lib/orders';

@Component({
    selector: 'products-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.scss']
})
export class ProductItemComponent {
    @Input() product: Product;

    constructor(private cartService: CartService) {}

    addProductToCart(): void {
        const cartItem: CartItem = {
            productId: this.product.id,
            quantity: 1
        };

        this.cartService.setCartItem(cartItem);
    }
}
