 import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ApiService } from './../../services/api.service';
import { AuthService } from './../../services/auth.service';
import { UserStoreService } from '../../services/user-store.service';
import { SpinnerService } from './../../services/spinner.service';
import { timer } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
/*   public users: any = [];
  public role!: string;
  public contracts = new MatTableDataSource<any>([]);
  public vehicles: any = [];
  public licenses: any = [];
  public insurance: any = [];
  public maintenanceContracts: any = [];
  public maintenanceRecords: any = [];
  public periodicMaintenance: any = [];
  showSpinner: boolean = false;
  userName: string = "";
  public fullName: string = "";
  public displayedColumns: string[] = ['index', 'contractId', 'startDateOfFinancing', 'endDateOfFinancing', 'contractStatus'];

  constructor(
    private api: ApiService,
    private auth: AuthService,
    private userStore: UserStoreService,
    public spinnerService: SpinnerService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.spinnerService.visibility.subscribe(show => {
      this.showSpinner = show;
      this.cdr.detectChanges();
    });

    this.api.getUsers().subscribe(res => {
      this.users = res;
    });


    this.userStore.getFullNameFromStore().subscribe(val => {
      const fullNameFromToken = this.auth.getfullNameFromToken();
      this.fullName = val || fullNameFromToken;
    });

    this.userStore.getRoleFromStore().subscribe(val => {
      const roleFromToken = this.auth.getRoleFromToken();
      this.role = val || roleFromToken;
    });

    timer(0, 1000).subscribe(() => {
      this.showSpinner = this.spinnerService.visibility.value;
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy(): void {}

  logout() {
    this.auth.signOut();
  }
 */

}

