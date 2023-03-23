import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
    CategoriesService,
    Category,
    Product,
    ProductsService
} from '@lib/products';
import { MessageService } from 'primeng/api';
import { timer } from 'rxjs';

@Component({
    selector: 'admin-products-form',
    templateUrl: './products-form.component.html',
    styleUrls: ['./products-form.component.scss']
})
export class ProductsFormComponent implements OnInit {
    form: FormGroup;
    categories: Category[] = [];
    isSubmitted = false;
    isEditMode = false;
    productId: string;
    imageDisplay: string | ArrayBuffer;
    uploadedFiles: any[] = [];

    constructor(
        private fb: FormBuilder,
        private productsService: ProductsService,
        private categoriesService: CategoriesService,
        private messageService: MessageService,
        private location: Location,
        private route: ActivatedRoute
    ) {}

    createForm(): void {
        this.form = this.fb.group({
            name: ['', Validators.required],
            brand: ['', Validators.required],
            category: ['', Validators.required],
            price: [null, Validators.required],
            countInStock: [null, Validators.required],
            isFeatured: [false],
            description: ['', Validators.required],
            richDescription: [''],
            image: ['', Validators.required]
            // images: [[]],
            // rating: [0],
            // numReviews: [0],
            // dateCreated: [Date.now]
        });
    }

    checkEditMode(): void {
        this.route.params.subscribe((params: any) => {
            if (params?.productId) {
                this.isEditMode = true;
                this.productId = params?.productId;
                this.getProductById(this.productId);
            }
        });
    }

    getProductById(productId: string): void {
        this.productsService
            .getProductById(productId)
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
                    image: product.image
                });

                if (product.image) {
                    this.imageDisplay = product.image;
                }

                this.form.controls['image'].setValidators([]);
                this.form.get('image')?.updateValueAndValidity();
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

    createProduct(productFormData: FormData): void {
        this.productsService.createProducts(productFormData).subscribe({
            next: (product: Product) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Product ${product.name} is created`
                });

                timer(2000).subscribe(() => {
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

    updateProduct(productFormData: FormData): void {
        this.productsService
            .updateProduct(productFormData, this.productId)
            .subscribe({
                next: (product: Product) => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Product ${product.name} is updated`
                    });

                    timer(2000).subscribe(() => {
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

    onCancel(): void {
        this.location.back();
    }

    getCategories(): void {
        this.categoriesService.getCategories().subscribe((categories) => {
            this.categories = categories;
        });
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
}
