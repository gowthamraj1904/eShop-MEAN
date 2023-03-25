import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { map, Observable } from 'rxjs';
import { Order } from '../models/order.model';

@Injectable()
export class OrdersService {
    apiUrl = `${environment.apiUrl}/orders`;

    constructor(private http: HttpClient) {}

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
}
