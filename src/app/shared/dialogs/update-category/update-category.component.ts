import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CategoryService} from '../../../services/Categories';
import Swal from 'sweetalert2';
import { CategoryDto } from '../../../services/products';

@Component({
  selector: 'app-update-category',
  templateUrl: './update-category.component.html',
  styleUrls: ['./update-category.component.scss']
})
export class UpdateCategoryComponent implements OnInit {
  categoryForm!: FormGroup;
  category!: CategoryDto;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<UpdateCategoryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { category: CategoryDto }
  ) {}

  ngOnInit(): void {
    this.category = this.data.category; // Get the category to update
    this.initForm();
  }

  initForm(): void {
    this.categoryForm = this.formBuilder.group({
      name: [this.category.name, Validators.required]
    });
  }

  submitForm(): void {
    if (this.categoryForm.valid) {
      const updatedCategory: CategoryDto = this.categoryForm.value;
      this.categoryService.updateCategory(this.category.id, updatedCategory).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'Category updated successfully!',
            showConfirmButton: false,
            timer: 1500
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error updating category',
            text: error.error.errors.Name || 'An unexpected error occurred',
          });
        }
      });
    }
  }

  confirmExit(): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, cancel!'
    }).then((result) => {
      if (result.isConfirmed) {
        this.dialogRef.close();
      }
    });
  }
}
