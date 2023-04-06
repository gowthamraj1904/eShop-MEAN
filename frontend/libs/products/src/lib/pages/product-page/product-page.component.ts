import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { CartItem, CartService } from '@lib/orders';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, OnDestroy {
    product: Product;

    quantity = 1;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private productsService: ProductsService,
        private cartService: CartService
    ) {}

    addProductToCart(): void {
        const cartItem: CartItem = {
            productId: this.product.id,
            quantity: this.quantity
        };

        this.cartService.setCartItem(cartItem);
    }

    private getProducts(productId: string): void {
        this.productsService
            .getProductById(productId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((product: Product) => {
                this.product = product;
            });
    }

    private getProductId(): void {
        this.route.params
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((params: any) => {
                if (params.productId) {
                    this.getProducts(params.productId);
                }
            });
    }

    ngOnInit(): void {
        this.getProductId();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
