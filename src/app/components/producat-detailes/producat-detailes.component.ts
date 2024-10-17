import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CartService } from '../../services/Cart/cart-service.service';
import { ProductDto } from '../../services/products';
import { CategoryDto, CategoryService } from '../../services/Categories';

@Component({
  selector: 'app-producat-detailes',
  templateUrl: './producat-detailes.component.html',
  styleUrl: './producat-detailes.component.scss'
})
export class ProducatDetailesComponent implements OnInit {
  category: CategoryDto = { id: '', name: '' };
  categoryId!: string;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private cartService: CartService,
    private categoryService: CategoryService,


  ) {}
  ngOnInit(): void {


        this.getCategoryById(this.data.categoryId);


  }
  getCategoryById(id: string): void {
    this.categoryService.getCategoryById(id).subscribe((category: CategoryDto) => {
      this.category = category;
      console.log(category);
    });
  }
  addToCart(product:ProductDto): void {
    Swal.fire({
      title: `<strong>${product.productName}</strong>`,
      html: `
        <img src="${product.imageUrl}" alt="Product Image" style="width:100px;height:100px;"><br>
        <strong>Price: ${product.price} ₪</strong><br><br>
        <p>Available Count: <span class="count">${product.count}</span></p>
        <label for="quantity">Quantity:</label>
        <input type="number" id="quantity" name="quantity" value="1" min="1" max="${product.count}" style="width:50px;">
      `,
      showCancelButton: true,
      confirmButtonText: 'Add to Cart',
      cancelButtonText: 'Cancel',
      preConfirm: () => {
        const quantityInput = document.getElementById('quantity') as HTMLInputElement;
        let quantity = parseInt(quantityInput.value, 10);

        if (quantity > product.count) {
          Swal.showValidationMessage(`The maximum available quantity is ${product.count}.`);
          quantity = product.count;
          quantityInput.value = product.count.toString();
        }

        return { quantity: quantity };
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const quantity = result.value?.quantity || 1;

        this.cartService.addToCart({
          id: product.id,
          title: product.productName,
          price: product.price,
          image: product.imageUrl,
          count: product.count
        }, quantity);

        Swal.fire('Added!', `${product.productName} has been added to your cart.`, 'success');
      }
    });
  }



  }


