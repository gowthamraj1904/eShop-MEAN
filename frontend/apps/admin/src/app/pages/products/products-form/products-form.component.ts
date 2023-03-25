import { Location } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    CategoriesService,
    Category,
    Product,
    ProductsService
} from '@lib/products';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil, timer } from 'rxjs';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit, OnDestroy {
    form: FormGroup;

    categories: Category[] = [];

    isSubmitted = false;

    isEditMode = false;

    imageDisplay: string | ArrayBuffer;

    uploadedFiles: any[] = [];

    private productId: string;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private location: Location,
        private route: ActivatedRoute,
        private formBuilder: FormBuilder,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private productsService: ProductsService
    ) {}

    private createForm(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            brand: ['', Validators.required],
            category: ['', Validators.required],
            price: [null, Validators.required],
            countInStock: [null, Validators.required],
            isFeatured: [false],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required],
            rating: [0],
            numReviews: [0]
            // images: [[]],
        });
    }

    private getCategories(): void {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((categories: Category[]) => {
                this.categories = categories;
            });
    }

    private checkEditMode(): void {
        this.route.params
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((params: any) => {
                if (params?.productId) {
                    this.isEditMode = true;
                    this.productId = params?.productId;
                    this.getProductById(this.productId);
                }
            });
    }

    private getProductById(productId: string): void {
        this.productsService
            .getProductById(productId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((product: Product) => {
                this.form.patchValue({
                    name: product.name,
                    brand: product.brand,
                    category: product.category?.id,
                    price: product.price,
                    countInStock: product.countInStock,
                    isFeatured: product.isFeatured,
                    description: product.description,
                    richDescription: product.richDescription,
                    image: product.image,
                    rating: product.rating,
                    numReviews: product.numReviews
                });

                if (product.image) {
                    this.imageDisplay = product.image;
                }

                this.form.controls['image'].setValidators([]);
                this.form.get('image')?.updateValueAndValidity();
            });
    }

    private createProduct(productFormData: FormData): void {
        this.productsService
            .createProducts(productFormData)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (product: Product) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} is created`
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
                        detail: 'Product is not created'
                    });
                }
            });
    }

    private updateProduct(productFormData: FormData): void {
        this.productsService
            .updateProduct(productFormData, this.productId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: (product: Product) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} is updated`
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
                        detail: 'Product is not updated'
                    });
                }
            });
    }

    onSubmit(): void {
        this.isSubmitted = true;

        if (this.form.invalid) {
            return;
        }

        const productFormData = new FormData();

        Object.keys(this.form.controls).map((key: string) => {
            productFormData.append(key, this.form.get(key)?.value);
        });

        if (this.isEditMode) {
            this.updateProduct(productFormData);
        } else {
            this.createProduct(productFormData);
        }
    }

    onCancel(): void {
        this.location.back();
    }

    onImageUpload(event: any): void {
        const file = event?.target?.files[0];

        if (file) {
            this.form.patchValue({
                image: file
            });
            this.form.get('image')?.updateValueAndValidity();

            const fileReader = new FileReader();

            fileReader.onload = () => {
                if (fileReader.result) {
                    this.imageDisplay = fileReader.result;
                }
            };
            fileReader.readAsDataURL(file);
        }

        // for (const file of event.files) {
        //     this.uploadedFiles.push(file);
        // }
    }

    ngOnInit(): void {
        this.createForm();
        this.checkEditMode();
        this.getCategories();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
