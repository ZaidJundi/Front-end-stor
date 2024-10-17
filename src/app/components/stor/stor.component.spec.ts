import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StorComponent } from './stor.component';

describe('StorComponent', () => {
  let component: StorComponent;
  let fixture: ComponentFixture<StorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [StorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
