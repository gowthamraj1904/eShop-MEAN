import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@lib/products';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit, OnDestroy {
    products: Product[];

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private productsService: ProductsService
    ) {}

    private getProducts(): void {
        this.productsService
            .getProducts()
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((products: Product[]) => {
                this.products = products;
            });
    }

    private onDeleteConfirmation(productId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteProduct(productId),
            reject: () => console.log('rejected')
        });
    }

    private deleteProduct(productId: string): void {
        this.productsService
            .deleteProduct(productId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (product: Product) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} is deleted`
                    });

                    this.getProducts();
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Product is not deleted'
                    });
                }
            });
    }

    onDeleteProduct(productId: string): void {
        this.onDeleteConfirmation(productId);
    }

    onEditProduct(productId: string): void {
        this.router.navigateByUrl(`admin/products/form/${productId}`);
    }

    ngOnInit(): void {
        this.getProducts();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
