import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable, switchMap } from 'rxjs';
import { Order } from '../models/order.model';
import { OrderItem } from '../models/order-item.model';
import { StripeService } from 'ngx-stripe';

@Injectable()
export class OrdersService {
    apiUrl = `${environment.apiUrl}/orders`;
    apiUrlProducts = `${environment.apiUrl}/products`;

    constructor(
        private http: HttpClient,
        private stripeService: StripeService
    ) {}

    getOrders(): Observable<Order[]> {
        return this.http.get<Order[]>(this.apiUrl);
    }

    getOrderById(orderId: string): Observable<Order> {
        return this.http.get<Order>(`${this.apiUrl}/${orderId}`);
    }

    createOrders(order: Order): Observable<Order> {
        return this.http.post<Order>(this.apiUrl, order);
    }

    updateOrder(
        orderStatus: { status: string },
        orderId: string
    ): Observable<Order> {
        return this.http.put<Order>(`${this.apiUrl}/${orderId}`, orderStatus);
    }

    deleteOrder(orderId: string): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${orderId}`);
    }

    getOrdersCount(): Observable<number> {
        return this.http
            .get<number>(`${this.apiUrl}/get/count`)
            .pipe(map((objectValue: any) => objectValue.ordersCount));
    }

    getTotalSales(): Observable<number> {
        return this.http
            .get<number>(`${this.apiUrl}/get/total-sales`)
            .pipe(map((objectValue: any) => objectValue.totalSales));
    }

    getProductById(productId: string): Observable<any> {
        return this.http.get<any>(`${this.apiUrlProducts}/${productId}`);
    }

    createCheckoutSession(orderItems: OrderItem[]): Observable<any> {
        return this.http
            .post<any>(`${this.apiUrl}/create-checkout-session`, orderItems)
            .pipe(
                switchMap((session: any) => {
                    return this.stripeService.redirectToCheckout({
                        sessionId: session.id
                    });
                })
            );
    }

    cacheOrderData(order: Order): void {
        localStorage.setItem('orderData', JSON.stringify(order));
    }

    getCacheOrderData(): Order {
        return JSON.parse(localStorage.getItem('orderData') as string);
    }

    removeCacheOrderData(): void {
        localStorage.removeItem('orderData');
    }
}
