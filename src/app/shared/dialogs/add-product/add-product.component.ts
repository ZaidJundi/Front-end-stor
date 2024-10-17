import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryDto, CreateUpdateProductDto, StorService } from '../../../services/products';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { CategoryService } from '../../../services/Categories';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss']
})
export class AddProductComponent {
  productForm!: FormGroup;
  categorys: CategoryDto[] = [];
  imagePreview: string | ArrayBuffer | null = null;
  selectedFile: File | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private storService: StorService,
    private dialogRef: MatDialogRef<AddProductComponent>,
    private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.categoryService.getCategoriesLookUp().subscribe((data: CategoryDto[]) => {
      this.categorys = data;
    });
  }

  initForm(): void {
    this.productForm = this.formBuilder.group({
      id: [''],
      categoryId: ['', Validators.required],
      productName: ['', Validators.required],
      description: ['', Validators.required],
      howToUse: ['', Validators.required],
      count: [0, [Validators.required, Validators.min(0)]],
      price: [0, [Validators.required, Validators.min(0)]],
      isActive: [true],
      imageUrl: ['', Validators.required], // Image path
    });
  }

  onFileSelected(event: Event): void {
    const fileInput = event.target as HTMLInputElement;
    if (fileInput.files && fileInput.files[0]) {
      this.selectedFile = fileInput.files[0];

      // Preview the image
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }

  submitForm(): void {
    if (this.productForm.invalid) {
      return;
    }

    const product: CreateUpdateProductDto = this.productForm.value;

    if (this.selectedFile) {
      this.storService.uploadImage(this.selectedFile).subscribe({
        next: (imagePath: string) => {
          product.imageUrl = imagePath;
          this.addProduct(product);
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
      this.addProduct(product);
    }
  }

  addProduct(product: CreateUpdateProductDto): void {
    this.storService.addProduct(product).subscribe({
      next: (newProduct: CreateUpdateProductDto) => {
        Swal.fire({
          icon: 'success',
          title: 'Product added successfully!',
          showConfirmButton: false,
          timer: 1500,
        });
        this.productForm.reset();
        this.dialogRef.close(newProduct);
      },
      error: (error: HttpErrorResponse) => {
        Swal.fire({
          icon: 'error',
          title: 'Error adding product',
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
