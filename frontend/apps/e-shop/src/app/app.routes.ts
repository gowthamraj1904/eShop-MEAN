import { Route } from '@angular/router';
import { HomePageComponent } from './pages/home-page/home-page.component';

export const appRoutes: Route[] = [
    {
        path: 'home',
        component: HomePageComponent
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
