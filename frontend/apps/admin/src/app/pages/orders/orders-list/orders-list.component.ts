import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Order, OrdersService } from '@lib/orders';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { OrderStatus } from '../models/order-status.model';
import { ORDER_STATUS } from '../order.constants';

@Component({
    selector: 'admin-orders-list',
    templateUrl: './orders-list.component.html',
    styleUrls: ['./orders-list.component.scss']
})
export class OrdersListComponent implements OnInit, OnDestroy {
    orders: Order[];

    orderStatuses: OrderStatus[] = ORDER_STATUS;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private router: Router,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private ordersService: OrdersService
    ) {}

    private getOrders(): void {
        this.ordersService
            .getOrders()
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((orders: Order[]) => {
                this.orders = orders;
            });
    }

    private onDeleteConfirmation(orderId: string): void {
        this.confirmationService.confirm({
            message: 'Do you want to delete this Order?',
            header: 'Delete Order',
            icon: 'pi pi-exclamation-triangle',
            accept: () => this.deleteOrder(orderId),
            reject: () => console.log('rejected')
        });
    }

    private deleteOrder(orderId: string): void {
        this.ordersService
            .deleteOrder(orderId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
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

    onDeleteOrder(orderId: string): void {
        this.onDeleteConfirmation(orderId);
    }

    onShowOrder(orderId: string): void {
        this.router.navigateByUrl(`shell/orders/${orderId}`);
    }

    ngOnInit(): void {
        this.getOrders();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
