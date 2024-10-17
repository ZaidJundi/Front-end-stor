import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllProducatsByCategoryComponent } from './all-producats-by-category.component';

describe('AllProducatsByCategoryComponent', () => {
  let component: AllProducatsByCategoryComponent;
  let fixture: ComponentFixture<AllProducatsByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AllProducatsByCategoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllProducatsByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
