import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { Observable } from 'rxjs';
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

    deleteOrder(orderId: string): Observable<Record<string, string>> {
        return this.http.delete<Record<string, string>>(
            `${this.apiUrl}/${orderId}`
        );
    }
}
