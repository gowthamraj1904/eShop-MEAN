import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@lib/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html',
    styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit, OnDestroy {
    form: FormGroup;

    isSubmitted = false;

    isEditMode = false;

    color: string;

    private categoryId: string;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private messageService: MessageService,
        private categoriesService: CategoriesService
    ) {}

    private createForm(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            icon: ['', Validators.required],
            color: ['']
        });
    }

    private checkEditMode(): void {
        this.route.params
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((params: any) => {
                if (params?.categoryId) {
                    this.isEditMode = true;
                    this.categoryId = params?.categoryId;

                    this.getCategoryById(this.categoryId);
                }
            });
    }

    private getCategoryById(categoryId: string): void {
        this.categoriesService
            .getCategoryById(categoryId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((category: Category) => {
                this.form.patchValue({
                    name: category.name,
                    icon: category.icon,
                    color: category.color
                });
            });
    }

    private createCategory(category: Category): void {
        this.categoriesService
            .createCategory(category)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (category: Category) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category ${category.name} is created`
                    });

                    timer(2000)
                        .pipe(takeUntil(this.endSubscription$))
                        .subscribe(() => {
                            this.location.back();
                        });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category is not created'
                    });
                }
            });
    }

    private updateCategory(category: Category): void {
        this.categoriesService
            .updateCategory(category)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (category: Category) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Category ${category.name} is updated`
                    });

                    timer(2000)
                        .pipe(takeUntil(this.endSubscription$))
                        .subscribe(() => {
                            this.location.back();
                        });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Category is not updated'
                    });
                }
            });
    }

    onSubmit(): void {
        this.isSubmitted = true;

        if (this.form.invalid) {
            return;
        }

        const category: Category = {
            id: this.categoryId,
            name: this.form.get('name')?.value,
            icon: this.form.get('icon')?.value,
            color: this.form.get('color')?.value
        };

        if (this.isEditMode) {
            this.updateCategory(category);
        } else {
            this.createCategory(category);
        }
    }

    onCancel(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.createForm();
        this.checkEditMode();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
