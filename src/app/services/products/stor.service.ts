import { Injectable } from '@angular/core';
import { Observable, forkJoin, of } from 'rxjs';
import { map, catchError, concatMap, switchMap } from 'rxjs/operators';
import { ProductDto,CreateUpdateProductDto, CategoryDto } from './models';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class StorService {
  private BASE_API_URL = "https://localhost:7120/api/";
  private PRODUCTS_API_URL = (id: string) => `Product/category/${id}`;
  private CATEGORIES_API_URL = "Category";
  private PRODUCT_API_URL = "Product/all-product";
  private PRODUCTS_API_URL_REQ = "Product";
  private UPLOAD_IMAGE_API_URL = "Product/upload-image";
  private categoriesCache: CategoryDto[] | null = null;
  private productsCache: { [key: string]: ProductDto[] } = {};

  constructor(private http: HttpClient) { }

  getProducts(): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(`${this.BASE_API_URL}${this.PRODUCT_API_URL}`);
  }
  getProductById(productId: string): Observable<any> {
    return this.http.get<any>(`${this.BASE_API_URL}${this.PRODUCTS_API_URL_REQ}/${productId}`);
  }
  addProduct(product: CreateUpdateProductDto, file?: File): Observable<CreateUpdateProductDto> {
    if (file) {
      return this.uploadImage(file).pipe(
        switchMap(imagePath => {
          product.imageUrl = imagePath;
          return this.http.post<CreateUpdateProductDto>(`${this.BASE_API_URL}${this.PRODUCTS_API_URL_REQ}`, product);
        }),
        catchError(error => {
          console.error('Error adding product with image:', error);
          return of(product);
        })
      );
    } else {
      return this.http.post<CreateUpdateProductDto>(`${this.BASE_API_URL}${this.PRODUCTS_API_URL_REQ}`, product);
    }
  }
  updateProduct(productId: string, product: CreateUpdateProductDto, file?: File): Observable<CreateUpdateProductDto> {
    if (file) {
      return this.uploadImage(file).pipe(
        switchMap(imagePath => {
          product.imageUrl = imagePath;
          return this.http.put<CreateUpdateProductDto>(`${this.BASE_API_URL}${this.PRODUCTS_API_URL_REQ}/${productId}`, product);
        }),
        catchError(error => {
          console.error('Error updating product with image:', error);
          return of(product);
        })
      );
    } else {
      return this.http.put<CreateUpdateProductDto>(`${this.BASE_API_URL}${this.PRODUCTS_API_URL_REQ}/${productId}`, product).pipe(
        catchError(error => {
          console.error('Error updating product:', error);
          return of(product);
        })
      );
    }
  }

  uploadImage(file: File): Observable<string> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post<{ imagePath: string }>(`${this.BASE_API_URL}${this.UPLOAD_IMAGE_API_URL}`, formData).pipe(
      map(response => response.imagePath),
      catchError(error => {
        console.error('Image upload failed:', error);
        return of('');
      })
    );
  }
  getCategories(): Observable<CategoryDto[]> {
    if (this.categoriesCache) {
      return of(this.categoriesCache);
    }
    const url = `${this.BASE_API_URL}${this.CATEGORIES_API_URL}`;
    return this.http.get<CategoryDto[]>(url).pipe(
      map(categories => {
        this.categoriesCache = categories;
        return categories;
      }),
      catchError((error) => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  getProductsByCategory(categoryId: string, pageNumber: number = 1, pageSize: number = 10): Observable<{ items: ProductDto[], totalItems: number }> {
    const url = `${this.BASE_API_URL}${this.PRODUCTS_API_URL(categoryId)}?pageNumber=${pageNumber}&pageSize=${pageSize}`;
    return this.http.get<{ items: ProductDto[], totalItems: number }>(url).pipe(
      map(response => {
        this.productsCache[categoryId] = response.items;
        return { items: response.items, totalItems: response.totalItems };
      }),
      catchError((error) => {
        console.error(`Error fetching products for category ${categoryId}:`, error);
        return of({ items: [], totalItems: 0 });
      })
    );
  }


  getProductsForAllCategories(): Observable<{ category: CategoryDto, products: ProductDto[], totalItems: number }[]> {
    return this.getCategories().pipe(
      concatMap(categories => {
        const requests = categories.map(category =>
          this.getProductsByCategory(category.id).pipe(
            map(({ items, totalItems }) => ({ category, products: items, totalItems })),
            catchError((error) => {
              console.error(`Error fetching products for category ${category.id}:`, error);
              return of({ category, products: [], totalItems: 0 });
            })
          )
        );
        return forkJoin(requests).pipe(
          map(results =>
            results.filter(result => result.products.length > 0)
          )
        );
      })
    );
  }
}
