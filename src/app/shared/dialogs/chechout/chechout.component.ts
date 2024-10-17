import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CartService } from '../../../services/Cart/cart-service.service';
import { GovernmentDto, GovernmentService } from '../../../services/Goverments';
import { CreateOrderDetailsDto, OrderDto, OrderService } from '../../../services/Orders';
import { ProductDto, StorService } from '../../../services/products';
import { FavoriteService } from '../../../services/Favorite/favorite-service.service';


@Component({
  selector: 'app-chechout',
  templateUrl: './chechout.component.html',
  styleUrls: ['./chechout.component.scss']
})
export class ChechoutComponent implements OnInit {
  checkoutForm!: FormGroup;
  totalPrice: number = 0;
  governments: GovernmentDto[] = [];
  productsByCategory: { category: any, products:ProductDto[] ,totalItems:number}[] = [];
  favoriteItems: any[] = [];

  constructor(
    private fb: FormBuilder,
    private cartService: CartService,
    private dialogRef: MatDialogRef<ChechoutComponent>,
    private governmentService: GovernmentService,
    private orderService: OrderService,
private storService:StorService,
private favoriteService:FavoriteService
  ) {
    this.dialogRef.disableClose = true;
  }

  ngOnInit(): void {
    this.checkoutForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', [
        Validators.required,
        Validators.pattern(/^(059|056|972|970)\d{7}$/)
      ]],
      governorate: ['', Validators.required],
      city: ['', Validators.required],
      address: ['', Validators.required]
    });

    this.governmentService.getGovernments().subscribe((data: GovernmentDto[]) => {
      this.governments = data;
    });

    this.totalPrice = this.cartService.getTotalPrice();

    this.dialogRef.backdropClick().subscribe(() => {
      this.confirmExit();
    });
  }

  submitForm() {
    if (this.checkoutForm.valid) {
      const formData = this.getFormData();
      const order = this.createOrderDto(formData);

      this.submitOrderAndDetails(order, formData);
    } else {
      this.showFormError();
    }
  }

  getFormData() {
    return this.checkoutForm.value;
  }

  createOrderDto(formData: any): OrderDto {
    return {
      govermantId: formData.governorate,
      customerCity: formData.city,
      customerName: formData.name,
      customerPhoneNumber: formData.phone,
      customerFullTitle: formData.address,
      status: 0,
      orderDate: new Date().toISOString()
    };
  }

  submitOrderAndDetails(order: OrderDto, formData: any) {
    this.orderService.submitOrder(order).subscribe({
      next: (orderResponse) => {
        const orderId = orderResponse.id;
        const orderDetails = this.createOrderDetails(orderId);

        this.orderService.submitOrderDetails(orderDetails).subscribe({
          next: () => this.showSuccessMessage(formData),
          error: (err) => {
            this.deleteOrder(orderId);
            this.showErrorFromServer(err);
          }
        });
      },
      error: (err) => this.showErrorFromServer(err)
    });
  }

  deleteOrder(orderId: string) {
    this.orderService.deleteOrder(orderId).subscribe({
      next: () => console.log('Order deleted due to failure in order details'),
      error: (err:any) => console.error('Failed to delete order:', err)
    });
  }
  loadFavoriteItems() {
    this.favoriteService.favorite$.subscribe(favoriteItems => {
      this.favoriteItems = favoriteItems;

      favoriteItems.forEach(item => {
        this.storService.getProductById(item.id).subscribe({
          next: (product) => {
            if (!product) {
              this.removeFromFavorite(item.id);
            }
          },
          error: () => {
            this.removeFromFavorite(item.id);
          }
        });
      });
    });
  }
  removeFromFavorite(productId: string) {
    this.favoriteService.removeFromFavorit(productId);
    this.loadFavoriteItems();
  }
  createOrderDetails(orderId: string): CreateOrderDetailsDto[] {
    const cartItems = this.cartService.getCartFromLocalStorage();
    return cartItems.map((item: any) => ({
      orderId: orderId,
      productId: item.id,
      count: item.quantity
    }));
  }


  showSuccessMessage(formData: any) {
    this.loadFavoriteItems();

    Swal.fire({
      title: 'Success!',
      html: `
        <strong>Order Details</strong><br>
        Name: ${formData.name}<br>
        Phone: ${formData.phone}<br>
        Governorate: ${formData.governorate}<br>
        City: ${formData.city}<br>
        Address: ${formData.address}<br>
        Total Price: ${this.totalPrice}
      `,
      icon: 'success'
    }).then(() => {
      this.cartService.clearCart();
      this.dialogRef.close();


    });
  }


  showErrorFromServer(err: any) {
    const errorMessage = err?.error?.message || 'Failed to process the request. Please try again.';
    Swal.fire({
      title: 'Error!',
      text: errorMessage,
      icon: 'error'
    });
  }

  showFormError() {
    Swal.fire({
      title: 'Form Error',
      text: 'Please fill in all fields correctly!',
      icon: 'error'
    });
  }

  confirmExit() {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to exit the form?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, exit',
      cancelButtonText: 'No, stay'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
}
