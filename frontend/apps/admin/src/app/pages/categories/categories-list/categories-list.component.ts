import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CategoriesService, Category } from '@lib/products';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';

@Component({
    selector: 'admin-categories-list',
    templateUrl: './categories-list.component.html',
    styleUrls: ['./categories-list.component.scss']
})
export class CategoriesListComponent implements OnInit, OnDestroy {
    categories: Category[] = [];

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private categoriesService: CategoriesService
    ) {}

    private getCategories(): void {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((categories: Category[]) => {
                this.categories = categories;
            });
    }

    private onDeleteConfirmation(categoryId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Category?',
            header: 'Delete Category',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteCategory(categoryId),
            reject: () => console.log('rejected')
        });
    }

    private deleteCategory(categoryId: string): void {
        this.categoriesService
            .deleteCategory(categoryId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category is deleted`
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

    onDeleteCategory(categoryId: string): void {
        this.onDeleteConfirmation(categoryId);
    }

    onEditCategory(categoryId: string): void {
        this.router.navigateByUrl(`admin/categories/form/${categoryId}`);
    }

    ngOnInit(): void {
        this.getCategories();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
