import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { Category } from '../../models/category.model';
import { CategoriesService } from '../../services/categories.service';

@Component({
    selector: 'products-categories-banner',
    templateUrl: './categories-banner.component.html',
    styleUrls: ['./categories-banner.component.scss']
})
export class CategoriesBannerComponent implements OnInit, OnDestroy {
    categories: Category[] = [];

    private endSubscription$: Subject<void> = new Subject();

    constructor(private categoriesService: CategoriesService) {}

    getCategories(): void {
        this.categoriesService
            .getCategories()
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((categories: Category[]) => {
                this.categories = categories;
            });
    }

    ngOnInit(): void {
        this.getCategories();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
