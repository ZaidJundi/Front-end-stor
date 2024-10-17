import { Component, Input, OnInit } from '@angular/core';
import { ProductDto, StorService } from '../../services/products';
import { CartService } from '../../services/Cart/cart-service.service';
import { Router } from '@angular/router';  // تأكد من استيراد Router بشكل صحيح
import Swal from 'sweetalert2';
import { ProducatDetailesComponent } from '../producat-detailes/producat-detailes.component';
import { MatDialog } from '@angular/material/dialog';
import { FavoriteService } from '../../services/Favorite/favorite-service.service';

@Component({
  selector: 'app-stor',
  templateUrl: './stor.component.html',
  styleUrls: ['./stor.component.scss']
})
export class StorComponent implements OnInit {
  productsByCategory: { category: any, products: ProductDto[] ,totalItems:number}[] = [];
  currentSlide = 0;
  slides = [
    'https://static.vecteezy.com/system/resources/previews/035/546/122/non_2x/online-pharmacy-web-banner-concept-medical-background-with-different-drug-vector.jpg',
    'https://cdn.vectorstock.com/i/500p/67/44/banner-online-pharmacy-service-vector-31816744.jpg',
    'https://static.vecteezy.com/system/resources/previews/010/810/333/non_2x/medicine-pharmacy-hospital-set-of-medicines-with-labels-banner-for-a-website-with-medical-items-illustration-in-cartoon-style-vector.jpg',
  ];
  @Input() products: ProductDto[] = [];

  constructor(private storService: StorService, private cartService: CartService,private favoriteService: FavoriteService,private  router:Router,private dialog:MatDialog) { }


  ngOnInit(): void {
    this.startSlideShow();

this.getProductsForAllCategories()
  }

  getProductsForAllCategories(){
  this.storService.getProductsForAllCategories().subscribe((data) => {
    console.log(data);
    this.productsByCategory = data;

  });
}
  openProductDetails(product: any) {
    this.dialog.open(ProducatDetailesComponent, {
      width: '80vw',
      data: product
    });
console.log(product)
  }
  showAllProducts(route: string, id?: string): void {
    if (id !== undefined) {
      this.router.navigate([`/${route}`, id]).then(() => {
        window.scrollTo(0, 0);
      });
    } else {
      this.router.navigate([`/${route}`]).then(() => {
        window.scrollTo(0, 0);
      });
    }
  }
  startSlideShow() {
    setInterval(() => {
      this.currentSlide = (this.currentSlide + 1) % this.slides.length;
    }, 3000);
  }

addToCart(product: ProductDto): void {
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
isFavorite(product: ProductDto): boolean {
  return this.favoriteService.isProductFavorite(product.id);
}

toggleFavorite(product: ProductDto): void {
  const isFavorite = this.favoriteService.isProductFavorite(product.id);

  if (isFavorite) {
    this.favoriteService.removeFromFavorit(product.id);
  } else {
    this.favoriteService.addToFavorit(product);
  }
}


}
