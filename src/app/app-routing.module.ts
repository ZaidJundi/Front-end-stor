import { DashboardComponent } from './components/dashboard/dashboard.component';

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';

import { AuthGuard } from './guards/auth.guard';
import { LayoutComponent } from './shared/layout/layout.component';
import { StorComponent } from './components/stor/stor.component';
import { AllProducatsByCategoryComponent } from './components/all-producats-by-category/all-producats-by-category.component';

import { ProducatDetailesComponent } from './components/producat-detailes/producat-detailes.component';
import { CountactUsComponent } from './components/countact-us/countact-us.component';
import { CategoriesAdminComponent } from './components/categories-admin/categories-admin.component';
import { ProductsAdminComponent } from './components/products-admin/products-admin.component';
import { DeliveryAreasAdminComponent } from './components/delivery-areas-admin/delivery-areas-admin.component';

const routes: Routes = [
  { path: '', redirectTo: 'stor', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: '', component: LayoutComponent, children: [
      { path: 'admin/dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
      { path: 'stor', component: StorComponent },
      { path: 'products-by-category/:categoryId', component: AllProducatsByCategoryComponent },
      { path: 'products-detailes/:id', component: ProducatDetailesComponent },
      {path:'contact-us', component:CountactUsComponent},
      { path: 'admin/categories', component: CategoriesAdminComponent, canActivate: [AuthGuard] },
      { path: 'admin/products', component: ProductsAdminComponent, canActivate: [AuthGuard] },
      { path: 'admin/delivery-areas', component:DeliveryAreasAdminComponent, canActivate: [AuthGuard] },

    ]
  },
  { path: '**', redirectTo: '' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
