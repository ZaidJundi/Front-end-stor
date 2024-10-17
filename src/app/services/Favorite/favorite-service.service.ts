import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoriteService {
  private favoriteSubject = new BehaviorSubject<any[]>([]);
  favorite$ = this.favoriteSubject.asObservable();
  private favoriteItems: any[] = [];

  constructor() {
    const storedFavorite = localStorage.getItem('favorite');
    if (storedFavorite) {
      this.favoriteItems = JSON.parse(storedFavorite);
      this.favoriteSubject.next(this.favoriteItems);
    }
  }


  addToFavorit(product: any) {
    const existingProduct = this.favoriteItems.find(item => item.id === product.id);

    if (!existingProduct) {
      this.favoriteItems.push(product);
      this.updateFavorit();
    }
  }
  removeFromFavorit(productId: string) {
    this.favoriteItems = this.favoriteItems.filter(item => item.id !== productId);
    this.updateFavorit();
  }

  isProductFavorite(productId: string): boolean {
    return this.favoriteItems.some(item => item.id === productId);
  }

  getFavoritFromLocalStorage(): any[] {
    return JSON.parse(localStorage.getItem('favorite') || '[]');
  }

  setFavoritToLocalStorage(favorit: any[]) {
    localStorage.setItem('favorite', JSON.stringify(favorit));
  }




  updateFavorit() {
    localStorage.setItem('favorite', JSON.stringify(this.favoriteItems));
    this.favoriteSubject.next(this.favoriteItems);
  }

  clearFavorit() {
    this.favoriteItems = [];
    this.updateFavorit();
  }


}
