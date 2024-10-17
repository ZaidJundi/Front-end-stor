import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common'; // Import CommonModule
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';

import { MatDialogModule } from '@angular/material/dialog';

import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { TokenInterceptor } from './interceptors/token.interceptor';
import { MatSortModule } from '@angular/material/sort';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatError, MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { LayoutComponent } from './shared/layout/layout.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { StorComponent } from './components/stor/stor.component';
import { ChechoutComponent } from './shared/dialogs/chechout/chechout.component';
import { AllProducatsByCategoryComponent } from './components/all-producats-by-category/all-producats-by-category.component';
import { ProducatDetailesComponent } from './components/producat-detailes/producat-detailes.component';
import { MatPaginatorModule } from '@angular/material/paginator'; // استيراد MatPaginatorModule

import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CountactUsComponent } from './components/countact-us/countact-us.component';
import { MatGridListModule } from '@angular/material/grid-list';
import { TermsOfServiceComponent } from './components/terms-of-service/terms-of-service.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { CategoriesAdminComponent } from './components/categories-admin/categories-admin.component';
import { ProductsAdminComponent } from './components/products-admin/products-admin.component';
import { AddCategoryComponent } from './shared/dialogs/add-category/add-category.component';
import { UpdateCategoryComponent } from './shared/dialogs/update-category/update-category.component';
import { AddProductComponent } from './shared/dialogs/add-product/add-product.component';
import { UpdateProductComponent } from './shared/dialogs/update-product/update-product.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DeliveryAreasAdminComponent } from './components/delivery-areas-admin/delivery-areas-admin.component';
import { AddDeliveryAreaComponent } from './shared/dialogs/add-delivery-area/add-delivery-area.component';
import { UpdateDeliveryAreaComponent } from './shared/dialogs/update-delivery-area/update-delivery-area.component'; // Import here



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    LayoutComponent,
    StorComponent,
ChechoutComponent,
AllProducatsByCategoryComponent,
ProducatDetailesComponent,
CountactUsComponent,
TermsOfServiceComponent,
PrivacyPolicyComponent,
CategoriesAdminComponent,
ProductsAdminComponent,
AddCategoryComponent,
UpdateCategoryComponent,
AddProductComponent,
UpdateProductComponent,
DeliveryAreasAdminComponent,
AddDeliveryAreaComponent,
UpdateDeliveryAreaComponent

  ],
  imports: [
    MatSelectModule,
    MatDialogModule,
    BrowserModule,
    RouterModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    SweetAlert2Module,
    BrowserAnimationsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatToolbarModule,
    MatSidenavModule,
    MatListModule,
    MatTableModule,
    MatMenuModule,
    MatProgressBarModule,
    CommonModule,
    MatSortModule,
    MatBadgeModule,
    MatAutocompleteModule,
MatError,
MatGridListModule,
MatPaginatorModule,
MatSlideToggleModule

  ],
  providers: [{
    provide: HTTP_INTERCEPTORS,
    useClass: TokenInterceptor,
    multi: true
  }, provideAnimationsAsync()],
  bootstrap: [AppComponent]
})
export class AppModule { }
