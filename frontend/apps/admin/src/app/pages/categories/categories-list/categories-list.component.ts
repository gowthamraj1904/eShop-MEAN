import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@lib/products';
import { MessageService, ConfirmationService } from 'primeng/api';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html',
    styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit {
    categories: Category[] = [];

    constructor(
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    getCategories(): void {
        this.categoriesService
            .getCategories()
            .subscribe((categories: Category[]) => {
                this.categories = categories;
            });
    }

    onDeleteConfirmation(categoryId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteCategory(categoryId),
            reject: () => console.log('rejected')
        });
    }

    deleteCategory(categoryId: string): void {
        this.categoriesService.deleteCategory(categoryId).subscribe({
            next: (category: Category) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Category ${category.name} is deleted`
                });

                this.getCategories();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Category is not deleted'
                });
            }
        });
    }

    onDeleteCategory(categoryId: string) {
        this.onDeleteConfirmation(categoryId);
    }

    onEditCategory(categoryId: string) {
        this.router.navigateByUrl(`categories/form/${categoryId}`);
    }

    ngOnInit(): void {
        this.getCategories();
    }
}
