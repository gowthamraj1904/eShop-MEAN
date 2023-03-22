import { Route } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShellComponent } from './shared/shell/shell.component';

export const appRoutes: Route[] = [
    {
        path: '',
        component: ShellComponent,
        children: [
            {
                path: 'dashboard',
                component: DashboardComponent
            }
        ]
    },
    // {
    //     path: '',
    //     redirectTo: 'shell',
    //     pathMatch: 'full'
    // },
    {
        path: '**',
        pathMatch: 'full',
        component: ShellComponent
    }
];
