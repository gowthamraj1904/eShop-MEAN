import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Order, OrdersService } from '@lib/orders';
import { MessageService } from 'primeng/api';
import { ORDER_STATUS } from '../order.constants';

@Component({
    selector: 'admin-orders-detail',
    templateUrl: './orders-detail.component.html',
    styleUrls: ['./orders-detail.component.scss']
})
export class OrdersDetailComponent implements OnInit {
    order!: Order;
    orderId: string;
    orderStatuses: { id: string; name: string }[] = [];
    selectedStatus: string;

    constructor(
        private ordersService: OrdersService,
        private route: ActivatedRoute,
        private messageService: MessageService
    ) {}

    mapOrderStatuses(): void {
        this.orderStatuses = Object.keys(ORDER_STATUS).map((key) => {
            return {
                id: key,
                name: ORDER_STATUS[key].label
            };
        });
    }

    onStatusChange(): void {
        console.log(this.selectedStatus);
        this.ordersService
            .updateOrder({ status: this.selectedStatus }, this.orderId)
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

    getOrderId(): void {
        this.route.params.subscribe((params: any) => {
            if (params?.orderId) {
                this.orderId = params?.orderId;
                this.getOrderById(this.orderId);
            }
        });
    }

    getOrderById(orderId: string): void {
        this.ordersService.getOrderById(orderId).subscribe((order: Order) => {
            this.order = order;

            if (order.status) {
                this.selectedStatus = order.status;
            }
        });
    }

    ngOnInit(): void {
        this.mapOrderStatuses();
        this.getOrderId();
    }
}
