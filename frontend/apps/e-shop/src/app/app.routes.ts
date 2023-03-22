import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { ProductListComponent } from './pages/product-list/product-list.component';

export const appRoutes: Route[] = [
    {
        path: 'home',
        component: HomePageComponent
    },
    {
        path: 'products',
        component: ProductListComponent
    },
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full'
    },
    {
        path: '**',
        pathMatch: 'full',
        component: HomePageComponent
    }
];
