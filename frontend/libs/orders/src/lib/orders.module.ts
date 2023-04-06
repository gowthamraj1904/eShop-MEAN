import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ordersRoutes } from './lib.routes';
import { CartService } from './services/cart.service';
import { CartIconComponent } from './components/cart-icon/cart-icon.component';
import { CartComponent } from './pages/cart/cart.component';
import { OrdersSummaryComponent } from './components/orders-summary/orders-summary.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CheckoutComponent } from './pages/checkout/checkout.component';

import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { PasswordModule } from 'primeng/password';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputMaskModule } from 'primeng/inputmask';
import { ThankYouComponent } from './pages/thank-you/thank-you.component';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        RouterModule.forChild(ordersRoutes),
        BadgeModule,
        ButtonModule,
        InputNumberModule,
        PasswordModule,
        DividerModule,
        DropdownModule,
        InputMaskModule
    ],
    exports: [CartIconComponent],
    declarations: [
        CartIconComponent,
        CartComponent,
        OrdersSummaryComponent,
        CheckoutComponent,
        ThankYouComponent
    ]
})
export class OrdersModule {
    constructor(cartService: CartService) {
        cartService.initCartLocalStorage();
    }
}
