import { Route } from '@angular/router';
import { ProductsListComponent } from './pages/products-list/products-list.component';
import { ProductPageComponent } from './pages/product-page/product-page.component';

export const productsRoutes: Route[] = [
    {
        path: 'products',
        component: ProductsListComponent
    },
    {
        path: 'category/:categoryId',
        component: ProductsListComponent
    },
    {
        path: 'products/:productId',
        component: ProductPageComponent
    }
];
