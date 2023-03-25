import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus } from '../models/order-status.model';
import { ORDER_STATUS } from '../order.constants';

@Pipe({
    name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {
    transform(orderStatus: string, key: string): string {
        const filteredStatus: any[] = ORDER_STATUS.filter(
            (status: OrderStatus) => status.code === orderStatus
        );
        return filteredStatus?.[0]?.[key];
    }
}
