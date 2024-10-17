import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import {  ProductDto, StorService } from '../../services/products';
import Swal from 'sweetalert2';
import { AddProductComponent } from '../../shared/dialogs/add-product/add-product.component';
import { UpdateProductComponent } from '../../shared/dialogs/update-product/update-product.component';
import { ProducatDetailesComponent } from '../producat-detailes/producat-detailes.component';

@Component({
  selector: 'app-products-admin',
  templateUrl: './products-admin.component.html',
  styleUrl: './products-admin.component.scss'
})
export class ProductsAdminComponent  implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'imageUrl', 'productName',  'price', 'count', 'isActive', 'actions'];
  listOfProducts: ProductDto[] = [];
  filteredProducts = new MatTableDataSource<ProductDto>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private storService: StorService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  ngAfterViewInit() {
    this.filteredProducts.sort = this.sort;
    this.filteredProducts.paginator = this.paginator;
  }

  loadProducts(): void {
    this.storService.getProducts().subscribe(res => {
      this.listOfProducts = res;
      this.filteredProducts.data = this.listOfProducts;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredProducts.filter = filterValue.trim().toLowerCase();
  }

  addProduct() {
    const dialogRef = this.dialog.open(AddProductComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Product added successfully', result);
        this.loadProducts();
      }
    });
  }
  editCategory(product: ProductDto) {
    const dialogRef = this.dialog.open(UpdateProductComponent, {
      width: '600px',
      data: { product }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Product updated successfully', result);
        this.loadProducts();
      }
    });
  }

  viewProduct(product: any) {
    this.dialog.open(ProducatDetailesComponent, {
      width: '80vw',
      data: product
    });
console.log(product)
  }


}
