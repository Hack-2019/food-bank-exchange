import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddDonationPageComponent } from './add-donation-page.component';

describe('AddDonationPageComponent', () => {
  let component: AddDonationPageComponent;
  let fixture: ComponentFixture<AddDonationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddDonationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddDonationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
