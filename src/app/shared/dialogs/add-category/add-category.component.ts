import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../../services/Categories';
import { CategoryDto } from '../../../services/products';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {
  categoryForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private categoryService: CategoryService,
    private dialogRef: MatDialogRef<AddCategoryComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.categoryForm = this.formBuilder.group({
      name: ['', Validators.required]
    });
  }

  submitForm(): void {
    if (this.categoryForm.valid) {
      const category: CategoryDto = this.categoryForm.value;
      this.categoryService.addCategory(category).subscribe({
        next: (newCategory: CategoryDto) => {
          Swal.fire({
            icon: 'success',
            title: 'Category added successfully!',
            showConfirmButton: false,
            timer: 1500
          });

          this.categoryForm.reset();
          this.dialogRef.close(newCategory);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error adding category',
            text: error?.error.message || 'An unexpected error occurred',
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
