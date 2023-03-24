import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@lib/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ORDER_STATUS } from '../order.constants';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit {
    orders: Order[];
    orderStatus: any = ORDER_STATUS;

    constructor(
        private ordersService: OrdersService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router
    ) {}

    getOrders(): void {
        this.ordersService.getOrders().subscribe((orders: Order[]) => {
            this.orders = orders;
        });
    }

    onDeleteConfirmation(orderId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Order?',
            header: 'Delete Order',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteOrder(orderId),
            reject: () => console.log('rejected')
        });
    }

    deleteOrder(orderId: string): void {
        this.ordersService.deleteOrder(orderId).subscribe({
            next: (order: Order) => {
                this.messageService.add({
                    severity: 'success',
                    summary: 'Success',
                    detail: `Order ${order.id} is deleted`
                });

                this.getOrders();
            },
            error: () => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Order is not deleted'
                });
            }
        });
    }

    onDeleteOrder(orderId: string) {
        this.onDeleteConfirmation(orderId);
    }

    onShowOrder(orderId: string) {
        this.router.navigateByUrl(`orders/${orderId}`);
    }

    ngOnInit(): void {
        this.getOrders();
    }
}
