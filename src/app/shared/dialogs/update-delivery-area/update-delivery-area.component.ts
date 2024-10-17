import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { GovernmentDto, GovernmentService } from '../../../services/Goverments';

@Component({
  selector: 'app-update-delivery-area',
  templateUrl: './update-delivery-area.component.html',
  styleUrl: './update-delivery-area.component.scss'
})
export class UpdateDeliveryAreaComponent implements OnInit {
  updateForm!: FormGroup;
  government!: GovernmentDto;

  constructor(
    private formBuilder: FormBuilder,
    private governmentService: GovernmentService,
    private dialogRef: MatDialogRef<UpdateDeliveryAreaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { government: GovernmentDto }
  ) {}

  ngOnInit(): void {
    this.government = this.data.government;
    this.initForm();
  }

  initForm(): void {
    this.updateForm = this.formBuilder.group({
      governmentName: [this.government.governmentName, Validators.required],
      deliveryPrice: [this.government.deliveryPrice, [Validators.required, Validators.min(1)]]
    });
  }


  submitForm(): void {
    if (this.updateForm.valid) {
      const government: GovernmentDto = this.updateForm.value;
      this.governmentService.updateGovernment(this.government.id, government).subscribe({
        next: () => {
          Swal.fire({
            icon: 'success',
            title: 'government updated successfully!',
            showConfirmButton: false,
            timer: 1500
          });
          this.dialogRef.close(true);
        },
        error: (error) => {
          Swal.fire({
            icon: 'error',
            title: 'Error updating government',
            text: error.error.errors.GovernmentName || 'An unexpected error occurred',
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
