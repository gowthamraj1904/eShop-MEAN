import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from '@lib/users';
import { OrderItem } from '../../models/order-item.model';
import { Order } from '../../models/order.model';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.model';
import { OrdersService } from '../../services/orders.service';
import { ORDER_STATUS } from '../../order.constants';
import { Subject, take, takeUntil } from 'rxjs';

@Component({
    selector: 'orders-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit, OnDestroy {
    form: FormGroup;

    isSubmitted = false;

    countries: Record<string, string>[] = [];

    orderItems: OrderItem[] = [];

    userId: string;

    private endSubscription$: Subject<void> = new Subject();

    constructor(
        private router: Router,
        private formBuilder: FormBuilder,
        private usersService: UsersService,
        private cartService: CartService,
        private orderService: OrdersService
    ) {}

    private createForm(): void {
        this.form = this.formBuilder.group({
            name: ['', Validators.required],
            email: ['', [Validators.required, Validators.email]],
            phone: ['', Validators.required],
            street: ['', Validators.required],
            apartment: ['', Validators.required],
            city: ['', Validators.required],
            zip: ['', Validators.required],
            country: ['', Validators.required]
        });
    }

    private getCountries(): void {
        this.countries = this.usersService.getCountries();
    }

    private getCartItems(): void {
        const cart: Cart = this.cartService.getCart();

        this.orderItems = cart.items?.map((item) => {
            return {
                product: item.productId,
                quantity: item.quantity
            };
        }) as OrderItem[];
    }

    private autofillUserData(): void {
        this.usersService
            .observeCurrentUser()
            .pipe(takeUntil(this.endSubscription$))
            .subscribe((user) => {
                this.userId = user?.id as string;

                this.form.patchValue({
                    name: user?.name,
                    email: user?.email,
                    phone: user?.phone,
                    street: user?.street,
                    apartment: user?.apartment,
                    city: user?.city,
                    zip: user?.zip,
                    country: user?.country
                });
            });
    }

    backToCart(): void {
        this.router.navigate(['/cart']);
    }

    placeOrder() {
        this.isSubmitted = true;
        if (this.form.invalid) {
            return;
        }

        const order: Order = {
            orderItems: this.orderItems,
            shippingAddress1: this.form.get('street')?.value,
            shippingAddress2: this.form.get('apartment')?.value,
            city: this.form.get('city')?.value,
            zip: this.form.get('zip')?.value,
            country: this.form.get('country')?.value,
            phone: this.form.get('phone')?.value,
            status: ORDER_STATUS[0].code,
            user: this.userId,
            dateOrdered: `${Date.now()}`
        };

        this.orderService.createOrders(order).subscribe(() => {
            this.cartService.emptyCart();
            this.router.navigate(['/thank-you']);
        });
    }

    ngOnInit(): void {
        this.createForm();
        this.getCountries();
        this.getCartItems();
        this.autofillUserData();
    }

    ngOnDestroy(): void {
        this.endSubscription$.next();
        this.endSubscription$.complete();
    }
}
