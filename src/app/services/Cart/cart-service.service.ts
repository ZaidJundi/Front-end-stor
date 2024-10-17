import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();
  private cartItems: any[] = [];

  constructor() {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      this.cartItems = JSON.parse(storedCart);
      this.cartSubject.next(this.cartItems);
    }
  }


  addToCart(product: any, quantity: number) {
    const existingProduct = this.cartItems.find(item => item.id === product.id);

    if (existingProduct) {
      existingProduct.quantity += quantity;
      if (existingProduct.quantity > product.count) {
        existingProduct.quantity = product.count;
      }
      existingProduct.totalPrice = existingProduct.quantity * existingProduct.price;
    } else {
      product.quantity = quantity;
      product.totalPrice = product.price * quantity;
      this.cartItems.push(product);
    }

    this.updateCart();
  }
  getCartFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('cart') || '[]');
  }

  setCartToLocalStorage(cart: any[]) {
    localStorage.setItem('cart', JSON.stringify(cart));
  }

  removeFromCart(productId: number) {
    let currentCart = this.getCartFromLocalStorage();
    currentCart = currentCart.filter(item => item.id !== productId);
    this.setCartToLocalStorage(currentCart);
    this.cartItems = currentCart;
    this.cartSubject.next(currentCart);
  }


  updateCart() {
    localStorage.setItem('cart', JSON.stringify(this.cartItems));
    this.cartSubject.next(this.cartItems);
  }

  clearCart() {
    this.cartItems = [];
    this.updateCart();
  }

  getTotalPrice() {
    return this.cartItems.reduce((total, item) => total + item.totalPrice, 0);
  }
}
