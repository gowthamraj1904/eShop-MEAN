import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../../services/orders.service';
import { CartService } from '../../services/cart.service';
import { Order } from '../../models/order.model';

@Component({
    selector: 'orders-thank-you',
    templateUrl: './thank-you.component.html',
    styleUrls: ['./thank-you.component.scss']
})
export class ThankYouComponent implements OnInit {
    constructor(
        private ordersService: OrdersService,
        private cartService: CartService
    ) {}

    private createOrder(): void {
        const order = this.ordersService.getCacheOrderData();

        this.ordersService.createOrders(order).subscribe(() => {
            this.cartService.emptyCart();
            this.ordersService.removeCacheOrderData();
        });
    }

    ngOnInit(): void {
        this.createOrder();
    }
}
