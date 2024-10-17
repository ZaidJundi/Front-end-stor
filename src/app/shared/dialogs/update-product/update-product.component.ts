import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryDto, CreateUpdateProductDto, StorService } from '../../../services/products';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../services/Categories';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-update-product',
  templateUrl: './update-product.component.html',
  styleUrls: ['./update-product.component.scss']
})
export class UpdateProductComponent {
  productForm!: FormGroup;
  categorys: CategoryDto[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private storService: StorService,
    private dialogRef: MatDialogRef<UpdateProductComponent>,
    private categoryService: CategoryService,
    @Inject(MAT_DIALOG_DATA) public data: { product: CreateUpdateProductDto }
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.categoryService.getCategoriesLookUp().subscribe((data: CategoryDto[]) => {
      this.categorys = data;
    });

    if (this.data && this.data.product) {
      this.productForm.patchValue(this.data.product);
      this.imagePreview = this.data.product.imageUrl; // Show the existing image
    }
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      id: [this.data?.product?.id || ''],
      categoryId: ['', Validators.required],
      productName: ['', Validators.required],
      description: ['', Validators.required],
      howToUse: ['', Validators.required],
      count: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      imageUrl: ['', Validators.required],
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];

      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);

      fileInput.value = '';
    }
  }


  submitForm(): void {
    if (this.productForm.invalid) {
      return;
    }

    const updatedProduct: CreateUpdateProductDto = this.productForm.value;

    if (this.selectedFile) {
      this.storService.uploadImage(this.selectedFile).subscribe({
        next: (imagePath: string) => {
          updatedProduct.imageUrl = imagePath;
          this.updateProduct(updatedProduct);
        },
        error: (err: HttpErrorResponse) => {
          Swal.fire({
            icon: 'error',
            title: 'Image Upload Error',
            text: err.message || 'Failed to upload image',
          });
        },
      });
    } else {
      this.updateProduct(updatedProduct);
    }
  }

  updateProduct(updatedProduct: CreateUpdateProductDto): void {
    this.storService.updateProduct(updatedProduct.id,updatedProduct).subscribe({
      next: (newProduct: CreateUpdateProductDto) => {
        Swal.fire({
          icon: 'success',
          title: 'Product updated successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.dialogRef.close(newProduct);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error updating product',
          text: error.error?.message || 'An unexpected error occurred',
        });
      }
    });
  }

  confirmExit(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
}
