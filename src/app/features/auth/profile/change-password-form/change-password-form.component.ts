import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-change-password-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="glass-card p-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
      <form [formGroup]="form" (ngSubmit)="save.emit()" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">New Password</label>
          <input formControlName="newPassword" type="password" class="input-field" placeholder="Min. 6 characters">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Confirm New Password</label>
          <input formControlName="confirmPassword" type="password" class="input-field" placeholder="••••••••">
        </div>
        <button type="submit" [disabled]="form.invalid || isLoading" class="btn-primary py-2.5">
          {{ isLoading ? 'Changing...' : 'Change Password' }}
        </button>
      </form>
    </div>
  `
})
export class ChangePasswordFormComponent {
    @Input({ required: true }) form!: FormGroup;
    @Input() isLoading = false;
    @Output() save = new EventEmitter<void>();
}
