import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { CategoryByCountOfProductsDto, CategoryService} from '../../services/Categories';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { AddCategoryComponent } from '../../shared/dialogs/add-category/add-category.component';
import { CategoryDto } from '../../services/products';
import { UpdateCategoryComponent } from '../../shared/dialogs/update-category/update-category.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-categories-admin',
  templateUrl: './categories-admin.component.html',
  styleUrls: ['./categories-admin.component.scss']
})
export class CategoriesAdminComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'name', 'producatCount', 'actions'];
  listOfCategories: CategoryByCountOfProductsDto[] = [];
  filteredCategories = new MatTableDataSource<CategoryByCountOfProductsDto>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private categoryService: CategoryService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit() {
    this.filteredCategories.sort = this.sort;
    this.filteredCategories.paginator = this.paginator;
  }

  loadCategories(): void {
    this.categoryService.getCategoriesWithWproduct().subscribe(res => {
      this.listOfCategories = res;
      this.filteredCategories.data = this.listOfCategories;
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filteredCategories.filter = filterValue.trim().toLowerCase();
  }

  addCategory() {
    const dialogRef = this.dialog.open(AddCategoryComponent, {
      width: '600px',
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Category added successfully', result);
        this.loadCategories();
      }
    });
  }

  editCategory(category: CategoryDto) {
    const dialogRef = this.dialog.open(UpdateCategoryComponent, {
      width: '600px',
      data: { category }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log('Category updated successfully', result);
        this.loadCategories();
      }
    });
  }


  deleteCategory(category: CategoryDto) {
    // Show confirmation dialog
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
        this.categoryService.deleteCategory(category.id).subscribe(() => {
          this.loadCategories();
          Swal.fire(
            'Deleted!',
            'The category has been deleted.',
            'success'
          );
        }, (error) => {
          Swal.fire(
            'Error!',
            'The category could not be deleted. Please try again.',
            'error'
          );
        });
      }
    });
  }
}
