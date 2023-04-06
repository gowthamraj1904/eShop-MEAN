import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { RouterModule } from '@angular/router';
import { appRoutes } from './app.routes';
import { HomePageComponent } from './pages/home-page/home-page.component';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { UiModule } from '@lib/ui';
import { MenuComponent } from './shared/menu/menu.component';
import {
    CategoriesService,
    ProductsModule,
    ProductsService
} from '@lib/products';
import { OrdersModule, OrdersService } from '@lib/orders';

import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { UsersService } from '@lib/users';

@NgModule({
    declarations: [
        AppComponent,
        HomePageComponent,
        HeaderComponent,
        FooterComponent,
        MenuComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        RouterModule.forRoot(appRoutes, {
            initialNavigation: 'enabledBlocking'
        }),
        UiModule,
        OrdersModule,
        ToastModule,
        ProductsModule
    ],
    providers: [
        CategoriesService,
        ProductsService,
        MessageService,
        OrdersService,
        UsersService
    ],
    bootstrap: [AppComponent]
})
export class AppModule {}
