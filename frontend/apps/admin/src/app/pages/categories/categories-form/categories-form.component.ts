import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { CategoriesService, Category } from '@lib/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
    selector: 'admin-categories-form',
    templateUrl: './categories-form.component.html',
    styleUrls: ['./categories-form.component.scss']
})
export class CategoriesFormComponent implements OnInit {
    form: FormGroup;
    isSubmitted = false;
    isEditMode = false;
    categoryId: string;

    constructor(
        private fb: FormBuilder,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    createForm(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            icon: ['', Validators.required],
            color: ['']
        });
    }

    checkEditMode(): void {
        this.route.params.subscribe((params: any) => {
            if (params?.categoryId) {
                this.isEditMode = true;
                this.categoryId = params?.categoryId;
                this.getCategoryById(this.categoryId);
            }
        });
    }

    getCategoryById(categoryId: string): void {
        this.categoriesService
            .getCategoryById(categoryId)
            .subscribe((category: Category) => {
                this.form.patchValue({
                    name: category.name,
                    icon: category.icon,
                    color: category.color
                });
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

    createCategory(category: Category): void {
        this.categoriesService.createCategories(category).subscribe({
            next: (category: Category) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Category ${category.name} is created`
                });

                timer(2000).subscribe(() => {
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

    updateCategory(category: Category): void {
        this.categoriesService.updateCategory(category).subscribe({
            next: (category: Category) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Category ${category.name} is updated`
                });

                timer(2000).subscribe(() => {
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

    onCancel(): void {
        this.location.back();
    }

    ngOnInit(): void {
        this.createForm();
        this.checkEditMode();
    }
}
