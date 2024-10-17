export interface ProductDto {
  id: string;
  categoryId:string;
  productName: string;
  howToUse:string;
  price: number;
  imageUrl: string;
  totalItems: number;
count:number;
isFavorite:boolean;
}
export interface CategoryDto {
  id: string;
  name: string;
}
export interface CreateUpdateProductDto {
  id: string;
  categoryId:string;
  productName: string;
  description: string;
  howToUse:string;
  price: number;
  imageUrl: string;
  count:number;
  isActive:Boolean
}
