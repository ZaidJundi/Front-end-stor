import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  constructor(private dialogRef: MatDialogRef<PrivacyPolicyComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }
}
