export interface OrderDetailesDto {
  orderId: string;
  productId: string;
  count: number;
}

export interface OrderDto {
  govermantId: string;
  customerCity: string;
  customerName: string;
  customerPhoneNumber: string;
  customerFullTitle: string;
  status: number;
  orderDate: string;
}

export interface CreateOrderDetailsDto {
  orderId: string;
  productId: string;
  count: number;
}

