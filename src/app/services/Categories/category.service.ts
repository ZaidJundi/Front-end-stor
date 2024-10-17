import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { CategoryByCountOfProductsDto, CategoryDto } from './models';
import { HttpClient } from '@angular/common/http';
import { ProductDto } from '../products';
@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private BASE_API_URL = "https://localhost:7120/api/";
  private CATEGORIES_API_URL = this.BASE_API_URL + "Category";
  private PRODUCTS_BY_CATEGORY_ID_API_URL = this.BASE_API_URL + "Product/all-producat-by-category-id/";
  private CATEGORY_BY_ID_API_URL = this.CATEGORIES_API_URL + "/";
  private CATEGORIES_with_product_count_API_URL = this.BASE_API_URL + "Category/with-product-count";


  constructor(private http: HttpClient) { }

  getCategories(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(this.CATEGORIES_API_URL);
  }
  getCategoriesWithWproduct(): Observable<CategoryByCountOfProductsDto[]> {
    return this.http.get<CategoryByCountOfProductsDto[]>(this.CATEGORIES_with_product_count_API_URL);
  }

  getCategoriesLookUp(): Observable<CategoryDto[]> {
    return this.http.get<CategoryDto[]>(`${this.CATEGORIES_API_URL}`).pipe(
      catchError(error => {
        console.error('Error fetching categories:', error);
        return of([]);
      })
    );
  }

  addCategory(category: CategoryDto): Observable<CategoryDto> {
    return this.http.post<CategoryDto>(this.CATEGORIES_API_URL, category);
  }
  updateCategory(id: string, category: CategoryDto): Observable<CategoryDto> {
    return this.http.put<CategoryDto>(`${this.CATEGORIES_API_URL}/${id}`, category);
  }

  getProductsByCategoryId(categoryId:string): Observable<ProductDto[]> {
    return this.http.get<ProductDto[]>(this.PRODUCTS_BY_CATEGORY_ID_API_URL + categoryId);
  }

  getCategoryById(categoryId: string): Observable<CategoryDto> {
    return this.http.get<CategoryDto>(this.CATEGORY_BY_ID_API_URL + categoryId);
  }
deleteCategory(id: string): Observable<CategoryDto> {
  return this.http.delete<CategoryDto>(`${this.CATEGORIES_API_URL}/${id}`);
}
}


