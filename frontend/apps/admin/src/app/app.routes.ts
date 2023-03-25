import { Route } from '@angular/router';
import { ShellComponent } from './shared/shell/shell.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';

import { CategoriesListComponent } from './pages/categories/categories-list/categories-list.component';
import { CategoriesFormComponent } from './pages/categories/categories-form/categories-form.component';
import { ProductsFormComponent } from './pages/products/products-form/products-form.component';
import { ProductsListComponent } from './pages/products/products-list/products-list.component';
import { UsersListComponent } from './pages/users/users-list/users-list.component';
import { UsersFormComponent } from './pages/users/users-form/users-form.component';
import { OrdersListComponent } from './pages/orders/orders-list/orders-list.component';
import { OrdersDetailComponent } from './pages/orders/orders-detail/orders-detail.component';
import { AuthGuard } from '@lib/users';

export const appRoutes: Route[] = [
    {
        path: 'admin',
        component: ShellComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent,
                title: 'Dashboard'
            },
            {
                path: 'categories',
                component: CategoriesListComponent,
                title: 'Categories'
            },
            {
                path: 'categories/form',
                component: CategoriesFormComponent,
                title: 'Category'
            },
            {
                path: 'categories/form/:categoryId',
                component: CategoriesFormComponent,
                title: 'Category'
            },
            {
                path: 'products',
                component: ProductsListComponent,
                title: 'Products'
            },
            {
                path: 'products/form',
                component: ProductsFormComponent,
                title: 'Product'
            },
            {
                path: 'products/form/:productId',
                component: ProductsFormComponent,
                title: 'Product'
            },
            {
                path: 'users',
                component: UsersListComponent,
                title: 'Users'
            },
            {
                path: 'users/form',
                component: UsersFormComponent,
                title: 'User'
            },
            {
                path: 'users/form/:userId',
                component: UsersFormComponent,
                title: 'User'
            },
            {
                path: 'orders',
                component: OrdersListComponent,
                title: 'Orders'
            },
            {
                path: 'orders/:orderId',
                component: OrdersDetailComponent,
                title: 'Order'
            }
        ]
    },
    {
        path: '',
        redirectTo: 'admin/dashboard',
        pathMatch: 'full'
    },
    {
        path: '**',
        pathMatch: 'full',
        redirectTo: 'admin/dashboard'
    }
];
