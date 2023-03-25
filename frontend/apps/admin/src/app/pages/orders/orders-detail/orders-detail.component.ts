import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@lib/orders';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { OrderStatus } from '../models/order-status.model';
import { ORDER_STATUS } from '../order.constants';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-detail.component.html',
    styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit, OnDestroy {
    order!: Order;

    orderStatuses: OrderStatus[] = ORDER_STATUS;

    selectedStatus: string;

    private orderId: string;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private route: ActivatedRoute,
        private messageService: MessageService,
        private ordersService: OrdersService
    ) {}

    private getOrderId(): void {
        this.route.params.subscribe((params: any) => {
            if (params?.orderId) {
                this.orderId = params?.orderId;
                this.getOrderById(this.orderId);
            }
        });
    }

    private getOrderById(orderId: string): void {
        this.ordersService.getOrderById(orderId).subscribe((order: Order) => {
            this.order = order;

            if (order.status) {
                this.selectedStatus = order.status;
            }
        });
    }

    onStatusChange(): void {
        this.ordersService
            .updateOrder({ status: this.selectedStatus }, this.orderId)
            .pipe(takeUntil(this.endSubscription$))
            .subscribe({
                next: () => {
                    this.messageService.add({
                        severity: 'success',
                        summary: 'Success',
                        detail: `Order is updated`
                    });
                },
                error: () => {
                    this.messageService.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Order is not updated'
                    });
                }
            });
    }

    ngOnInit(): void {
        this.getOrderId();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
