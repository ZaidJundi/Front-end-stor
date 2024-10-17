import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GovernmentDto, GovernmentService } from '../../../services/Goverments';

@Component({
  selector: 'app-add-delivery-area',
  templateUrl: './add-delivery-area.component.html',
  styleUrl: './add-delivery-area.component.scss'
})
export class AddDeliveryAreaComponent implements OnInit {
  governmentForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private governmentService: GovernmentService,
    private dialogRef: MatDialogRef<AddDeliveryAreaComponent>
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.governmentForm = this.formBuilder.group({
      governmentName: ['', Validators.required],
      deliveryPrice: [0, [Validators.required, Validators.min(1)]]
    });
  }

  submitForm(): void {
    if (this.governmentForm.valid) {
      const government: GovernmentDto = this.governmentForm.value;
      this.governmentService.addGovernment(government).subscribe({
        next: (newGovernment: GovernmentDto) => {
          Swal.fire({
            icon: 'success',
            title: 'Government added successfully!',
            showConfirmButton: false,
            timer: 1500
          });

          this.governmentForm.reset();
          this.dialogRef.close(newGovernment);
        },
        error: (error) => {
          let errorMsg = 'An unexpected error occurred';
          if (error?.status === 400) {
            errorMsg = 'Invalid input. Please check the form values.';
          } else if (error?.status === 500) {
            errorMsg = 'Server error. Please try again later.';
          }
          Swal.fire({
            icon: 'error',
            title: 'Error adding government',
            text: error?.error?.message || errorMsg,
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
