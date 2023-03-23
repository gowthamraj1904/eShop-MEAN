import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Product, ProductsService } from '@lib/products';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    selector: 'admin-products-list',
    templateUrl: './products-list.component.html',
    styleUrls: ['./products-list.component.scss']
})
export class ProductsListComponent implements OnInit {
    products: Product[];

    constructor(
        private productsService: ProductsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    getProducts(): void {
        this.productsService.getProducts().subscribe((products: Product[]) => {
            this.products = products;
        });
    }

    onDeleteConfirmation(productId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Product?',
            header: 'Delete Product',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteProduct(productId),
            reject: () => console.log('rejected')
        });
    }

    deleteProduct(productId: string): void {
        this.productsService.deleteProduct(productId).subscribe({
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

    onDeleteProduct(productId: string) {
        this.onDeleteConfirmation(productId);
    }

    onEditProduct(productId: string) {
        this.router.navigateByUrl(`products/form/${productId}`);
    }

    ngOnInit(): void {
        this.getProducts();
    }
}
