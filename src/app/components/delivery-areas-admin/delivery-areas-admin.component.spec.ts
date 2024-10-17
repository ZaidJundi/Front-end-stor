import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeliveryAreasAdminComponent } from './delivery-areas-admin.component';

describe('DeliveryAreasAdminComponent', () => {
  let component: DeliveryAreasAdminComponent;
  let fixture: ComponentFixture<DeliveryAreasAdminComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeliveryAreasAdminComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeliveryAreasAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
