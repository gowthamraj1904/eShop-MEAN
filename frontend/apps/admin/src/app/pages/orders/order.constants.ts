import { OrderStatus } from './models/order-status.model';

export const ORDER_STATUS: OrderStatus[] = [
    {
        code: 'pending',
        label: 'Pending',
        color: 'primary'
    },
    {
        code: 'processed',
        label: 'Processed',
        color: 'warning'
    },
    {
        code: 'shipped',
        label: 'Shipped',
        color: 'warning'
    },
    {
        code: 'delivered',
        label: 'Delivered',
        color: 'success'
    },
    {
        code: 'failed',
        label: 'Failed',
        color: 'danger'
    }
];
