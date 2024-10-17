import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CountactUsComponent } from './countact-us.component';

describe('CountactUsComponent', () => {
  let component: CountactUsComponent;
  let fixture: ComponentFixture<CountactUsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CountactUsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CountactUsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
