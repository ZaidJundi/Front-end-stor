import { Component } from '@angular/core';
import { FormBuilder, FormGroup,  Validators } from '@angular/forms';

@Component({
  selector: 'app-countact-us',
  templateUrl: './countact-us.component.html',
  styleUrl: './countact-us.component.scss'
})
export class CountactUsComponent {
  contactForm: FormGroup;
  slides = [
    'https://www.openproject.org/assets/images/contact/hero-contact-4cf9fa21.png'
  ];

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', Validators.required]
    });

  }
  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Form Submitted', this.contactForm.value);
    } else {
      console.log('Form Invalid', this.contactForm);
    }
  }

  }

