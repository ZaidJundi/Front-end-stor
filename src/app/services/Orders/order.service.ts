import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OrderDto, OrderDetailesDto } from './models';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private BASE_API_URL = "https://localhost:7120/api/";
  private ORDER_API_URL = this.BASE_API_URL + "Order";
  private ORDER_DELETE_API_URL = this.ORDER_API_URL + "/";

  private ORDER_DETAILS_API_URL = this.BASE_API_URL + "OrderDetailes";
  constructor(private http: HttpClient) {}

  submitOrder(order: OrderDto): Observable<any> {
    return this.http.post(this.ORDER_API_URL, order);
  }

  submitOrderDetails(orderDetails: OrderDetailesDto[]): Observable<any> {
    return this.http.post(this.ORDER_DETAILS_API_URL, orderDetails);
  }
  deleteOrder(orderId: string): Observable<any> {
    return this.http.delete(this.ORDER_DELETE_API_URL + orderId);
  }
}
