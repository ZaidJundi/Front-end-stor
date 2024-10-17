import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProducatDetailesComponent } from './producat-detailes.component';

describe('ProducatDetailesComponent', () => {
  let component: ProducatDetailesComponent;
  let fixture: ComponentFixture<ProducatDetailesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ProducatDetailesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProducatDetailesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
