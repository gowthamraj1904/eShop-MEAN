import { Component, OnDestroy, OnInit } from '@angular/core';
import { Product } from '../../models/product.model';
import { ProductsService } from '../../services/products.service';
import { Subject, takeUntil } from 'rxjs';
import { CategoriesService } from '../../services/categories.service';
import { Category } from '../../models/category.model';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'products-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products: Product[];

    categories: Category[];

    isCategoryPage: boolean;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private productsService: ProductsService,
        private categoriesService: CategoriesService
    ) {}

    getCategories(): void {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((categories) => {
                this.categories = categories;
            });
    }

    getProducts(categoriesFilter?: string[]): void {
        this.productsService
            .getProducts(categoriesFilter)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((products) => {
                this.products = products;
            });
    }

    onCheckboxChange(): void {
        const selectedCategories = this.categories
            .filter((category: Category) => category.checked)
            .map((category: Category) => category.id) as string[];

        this.getProducts(selectedCategories);
    }

    checkRoute(): void {
        this.route.params.subscribe((params: any) => {
            params?.categoryId
                ? this.getProducts([params?.categoryId])
                : this.getProducts();

            this.isCategoryPage = params?.categoryId ? true : false;
        });
    }

    ngOnInit(): void {
        this.checkRoute();
        this.getCategories();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
