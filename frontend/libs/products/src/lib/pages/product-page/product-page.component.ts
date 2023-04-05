import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'products-product-page',
    templateUrl: './product-page.component.html',
    styleUrls: ['./product-page.component.scss']
})
export class ProductPageComponent implements OnInit, OnDestroy {
    product: Product;

    quantity: number;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private productsService: ProductsService
    ) {}

    addProductToCart(): void {
        console.log(this.product);
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
