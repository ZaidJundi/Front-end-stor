import {   Input,
  Component, ViewChild, OnDestroy, ChangeDetectorRef, AfterViewInit, OnInit } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { MediaMatcher } from '@angular/cdk/layout';
import { AuthService } from './../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { MatTableDataSource } from '@angular/material/table';

import Swal from 'sweetalert2';
import { CartService } from '../../services/Cart/cart-service.service';
import { ChechoutComponent } from '../dialogs/chechout/chechout.component';

import { MatDialog } from '@angular/material/dialog';
import {  CategoryService } from '../../services/Categories';
import { Router, NavigationEnd } from '@angular/router';
import { ProductDto, StorService } from '../../services/products';
import { ProducatDetailesComponent } from '../../components/producat-detailes/producat-detailes.component';
import { TermsOfServiceComponent } from '../../components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from '../../components/privacy-policy/privacy-policy.component';
import { FavoriteService } from '../../services/Favorite/favorite-service.service';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnDestroy, AfterViewInit, OnInit {

  @ViewChild('sidenav') sidenav!: MatSidenav;
  mobileQuery: MediaQueryList;
  public name!: string;
  notifications: string[] = [];
  private _mobileQueryListener: () => void;
  shouldShowMenuButton = true;
  isLoggedIn = false;
  cartItems: any[] = [];
  favoriteItems: any[] = [];
  shouldShowFooter = true;
  hideFooterRoutes = ['/admin/categories', '/admin/products', '/admin/delivery-areas'];

  totalPrice: number = 0;
  categories: any[] = [];
  filteredProducts: ProductDto[] = [];
  currentRoute = window.location.pathname;
  @Input() products: ProductDto[] = [];
  test!: string;
  dataSource = new MatTableDataSource<ProductDto>( this.filteredProducts
  );

  constructor(
    private mediaMatcher: MediaMatcher,
    private cdr: ChangeDetectorRef,
    private auth: AuthService,
    private userStore: UserStoreService,
    private router: Router,
    private cartService: CartService,
    private favoriteService: FavoriteService,

    private dialog: MatDialog,
private categoryService:CategoryService,
private storService:StorService

  ) {
    this.mobileQuery = this.mediaMatcher.matchMedia('(max-width: 600px)');
    this._mobileQueryListener = () => this.cdr.detectChanges();
    this.mobileQuery.addEventListener('change', this._mobileQueryListener);
    this.userStore.getFullNameFromStore().subscribe(val => {
      const roleFromToken = this.auth.getfullNameFromToken();
      this.name = val || roleFromToken;
    });
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkFooterVisibility(event.urlAfterRedirects);
      }
    });
  }

  ngOnInit() {
    this.checkLoginStatus();
    this.loadCategories();
    this.loadProducts();
    this.loadCartItems();
    this.loadFavoriteItems();
    if (this.hideFooterRoutes.includes(this.currentRoute)) {
      this.shouldShowFooter = false;
    }
  }

  checkLoginStatus() {
    const token = this.auth.getToken();
    this.isLoggedIn = !!token;
  }

  loadCategories() {
    this.categoryService.getCategories().subscribe(categories => {
      this.categories = categories;
      console.log('Loaded categories:', this.categories);
    });
  }
  checkFooterVisibility(currentRoute: string) {
    this.shouldShowFooter = !this.hideFooterRoutes.includes(currentRoute);
  }
  loadProducts() {
    this.storService.getProducts().subscribe(products => {
      this.products = products;
      console.log('Loaded products:', this.products);
    });
  }

  loadCartItems() {
    this.cartService.cart$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.totalPrice = this.cartService.getTotalPrice();

      cartItems.forEach(item => {
        this.storService.getProductById(item.id).subscribe({
          next: (product) => {
            if (!product) {
              this.removeFromCart(item.id);
            }
          },
          error: () => {
            this.removeFromCart(item.id);
          }
        });
      });
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

  removeFromCart(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  onCategoryClick(route: string, id?: number): void {
    if (id !== undefined) {
      this.router.navigate([`/${route}`, id]);
    } else {
      this.router.navigate([`/${route}`]);
    }
  }



  get getFavoriteCount(): number {
    const uniqueItems = new Set(this.favoriteItems.map(item => item.id));
    return uniqueItems.size;
  }

  openProductDetails(product: any) {
    this.dialog.open(ProducatDetailesComponent, {
      width: '80vw',
      data: product
    });
console.log(product)
  }
  search() {
    console.log('Search invoked with:', this.test);

    if (this.test && this.test.trim() && this.test.trim().length >= 2) {
      this.filteredProducts = this.products.filter(
        (product) =>
          product.productName.toLowerCase().includes(this.test.toLowerCase())
      );
    } else {
      this.filteredProducts = [];
    }

    console.log('Filtered Products:', this.filteredProducts);
  }




  checkout() {
     this.dialog.open(ChechoutComponent, {
      width: '400px',
      data: { cartItems: this.cartItems, totalPrice: this.totalPrice }
    });

  }



  removeFromFavorite(productId: string) {
    this.favoriteService.removeFromFavorit(productId);
    this.loadFavoriteItems();
  }
  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  get getUniqueProductCount(): number {
    const uniqueItems = new Set(this.cartItems.map(item => item.id));
    return uniqueItems.size;
  }

  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }

  toggleSidenav() {
    this.sidenav.toggle();
  }


  logout() {
    Swal.fire({
      title: 'Are You Sure?',
      text: 'Do you really want to log out?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Log Out',
      cancelButtonText: 'Cancel'
    }).then((result) => {
      if (result.isConfirmed) {
        this.auth.signOut();
        Swal.fire(
          'Logged Out!',
          'You have successfully logged out.',
          'success'
        );
      }
    });
  }

  openTermsDialog(): void {
    this.dialog.open(TermsOfServiceComponent);
  }
  openPrivacyDialog(): void {
    const dialogRef = this.dialog.open(PrivacyPolicyComponent);

    dialogRef.afterOpened().subscribe(() => {
      setTimeout(() => {
        const container = document.querySelector('.policy-container') as HTMLElement;
        if (container) {
          container.scrollTop = 0;
        }
      }, 0);
    });
  }
}
