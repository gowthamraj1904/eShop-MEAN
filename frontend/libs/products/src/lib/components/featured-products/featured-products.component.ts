import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';

@Component({
    selector: 'products-featured-products',
    templateUrl: './featured-products.component.html',
    styleUrls: ['./featured-products.component.scss']
})
export class FeaturedProductsComponent implements OnInit, OnDestroy {
    products: Product[] = [];

    private endSubscription$: Subject<void> = new Subject();

    constructor(private productsService: ProductsService) {}

    getFeaturedProducts(): void {
        this.productsService
            .getFeaturedProducts(4)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((products: Product[]) => {
                this.products = products;
            });
    }

    ngOnInit(): void {
        this.getFeaturedProducts();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
