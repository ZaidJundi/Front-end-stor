import { Component, OnInit } from '@angular/core';
import { ProductDto } from '../../services/products';
import { ActivatedRoute } from '@angular/router';
import { CategoryDto, CategoryService } from '../../services/Categories';
import Swal from 'sweetalert2';
import { CartService } from '../../services/Cart/cart-service.service';
import { ProducatDetailesComponent } from '../producat-detailes/producat-detailes.component';
import { MatDialog } from '@angular/material/dialog';
import { FavoriteService } from '../../services/Favorite/favorite-service.service';
@Component({
  selector: 'app-all-producats-by-category',
  templateUrl: './all-producats-by-category.component.html',
  styleUrl: './all-producats-by-category.component.scss'
})
export class AllProducatsByCategoryComponent implements OnInit {
  categoryId!: string;
  productsByCategory: ProductDto[] = [];
  currentSlide = 0;
  category: CategoryDto = { id: '', name: '' }; // Provide default values

  slides = [
    'https://static.vecteezy.com/system/resources/previews/035/546/122/non_2x/online-pharmacy-web-banner-concept-medical-background-with-different-drug-vector.jpg',
    'https://cdn.vectorstock.com/i/500p/67/44/banner-online-pharmacy-service-vector-31816744.jpg',
    'https://static.vecteezy.com/system/resources/previews/010/810/333/non_2x/medicine-pharmacy-hospital-set-of-medicines-with-labels-banner-for-a-website-with-medical-items-illustration-in-cartoon-style-vector.jpg',
  ];

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
private cartService:CartService,
private dialog:MatDialog,
private favoriteService:FavoriteService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.categoryId = params.get('categoryId') ?? '';

        this.getProductsByCategory(this.categoryId);
        this.getCategoryById(this.categoryId);

    });
  }

  getProductsByCategory(id: string): void {
    this.categoryService.getProductsByCategoryId(id).subscribe((products: ProductDto[]) => {
      this.productsByCategory = products;
      console.log(products);
    });
  }
  openProductDetails(product: any) {
    this.dialog.open(ProducatDetailesComponent, {
      width: '80vw',
      data: product
    });
console.log(product)
  }
  getCategoryById(id: string): void {
    this.categoryService.getCategoryById(id).subscribe((category: CategoryDto) => {
      this.category = category;
      console.log(category);
    });
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
