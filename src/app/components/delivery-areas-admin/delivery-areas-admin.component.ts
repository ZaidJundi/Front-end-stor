import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { UpdateCategoryComponent } from '../../shared/dialogs/update-category/update-category.component';
import Swal from 'sweetalert2';
import { GovernmentDto, GovernmentService } from '../../services/Goverments';
import { AddDeliveryAreaComponent } from '../../shared/dialogs/add-delivery-area/add-delivery-area.component';
import { UpdateDeliveryAreaComponent } from '../../shared/dialogs/update-delivery-area/update-delivery-area.component';

@Component({
  selector: 'app-delivery-areas-admin',
  templateUrl: './delivery-areas-admin.component.html',
  styleUrl: './delivery-areas-admin.component.scss'
})
export class DeliveryAreasAdminComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['id', 'governmentName', 'deliveryPrice', 'actions'];
  listOfGovernments: GovernmentDto[] = [];
  filteredGovernments = new MatTableDataSource<GovernmentDto>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private governmentService: GovernmentService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadGovernments();
  }

  ngAfterViewInit() {
    this.filteredGovernments.sort = this.sort;
    this.filteredGovernments.paginator = this.paginator;
  }

  loadGovernments(): void {
    this.governmentService.getGovernments().subscribe(res => {
      this.listOfGovernments = res;
      this.filteredGovernments.data = this.listOfGovernments;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredGovernments.filter = filterValue.trim().toLowerCase();
  }

  addGovernment() {
    const dialogRef = this.dialog.open(AddDeliveryAreaComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Government added successfully', result);
        this.loadGovernments();
      }
    });
  }

  editGovernment(government: GovernmentDto) {
console.log(government);
    const dialogRef = this.dialog.open(UpdateDeliveryAreaComponent, {
      width: '600px',
      data: { government }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Government updated successfully', result);
        this.loadGovernments();
      }
    });
  }


  deleteGovernment(government: GovernmentDto) {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel'
    }).then((result) => {
       if (result.isConfirmed) {
        this.governmentService.deleteGovernment(government.id).subscribe(() => {
          this.loadGovernments();
          Swal.fire(
            'Deleted!',
            'The government has been deleted.',
            'success'
          );
        }, (error) => {
          Swal.fire(
            'Error!',
            'The government could not be deleted. Please try again.',
            'error'
          );
        });
      }
    });
  }
}
