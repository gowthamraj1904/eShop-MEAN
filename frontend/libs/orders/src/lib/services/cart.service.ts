import { Injectable } from '@angular/core';
import { Cart, CartItem } from '../models/cart.model';
import { BehaviorSubject } from 'rxjs';
import { MessageService } from 'primeng/api';

@Injectable()
export class CartService {
    cart$: BehaviorSubject<Cart> = new BehaviorSubject(this.getCart());

    constructor(private messageService: MessageService) {}

    initCartLocalStorage(): void {
        const cart = this.getCart();

        if (!cart) {
            const initialCart = {
                items: []
            };

            localStorage.setItem('cart', JSON.stringify(initialCart));
        }
    }

    emptyCart(): void {
        const initialCart = {
            items: []
        };

        localStorage.setItem('cart', JSON.stringify(initialCart));
        this.cart$.next(initialCart);
    }

    getCart(): Cart {
        const cart = JSON.parse(localStorage.getItem('cart') as string) as Cart;
        return cart;
    }

    setCartItem(cartItem: CartItem, updateCartItem?: boolean): Cart {
        const cart = this.getCart();
        const isCartItemExist = cart.items?.find(
            (item: CartItem) => item.productId === cartItem.productId
        );

        if (isCartItemExist) {
            cart.items?.map((item: CartItem): CartItem => {
                if (item.productId === cartItem.productId) {
                    if (updateCartItem) {
                        item.quantity = cartItem.quantity;
                    } else {
                        item.quantity =
                            Number(item.quantity) + Number(cartItem.quantity);
                    }
                }
                return item;
            });
        } else {
            cart.items?.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart$.next(cart);

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product added to the cart`
        });

        return cart;
    }

    deleteCartItem(productId: string): void {
        const cart = this.getCart();
        const newCart = cart.items?.filter(
            (item) => item.productId !== productId
        );

        cart.items = newCart;

        localStorage.setItem('cart', JSON.stringify(cart));
        this.cart$.next(cart);

        this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: `Product added to the cart`
        });
    }
}
