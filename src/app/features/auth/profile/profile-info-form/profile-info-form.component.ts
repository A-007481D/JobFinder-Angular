import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';

@Component({
    selector: 'app-profile-info-form',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    template: `
    <div class="glass-card p-8">
      <h2 class="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
      <form [formGroup]="form" (ngSubmit)="save.emit()" class="space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">First Name</label>
            <input formControlName="firstName" type="text" class="input-field">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-600 mb-1.5">Last Name</label>
            <input formControlName="lastName" type="text" class="input-field">
          </div>
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1.5">Email</label>
          <input formControlName="email" type="email" class="input-field">
        </div>
        <button type="submit" [disabled]="form.invalid || isLoading" class="btn-primary py-2.5">
          {{ isLoading ? 'Saving...' : 'Save Changes' }}
        </button>
      </form>
    </div>
  `
})
export class ProfileInfoFormComponent {
    @Input({ required: true }) form!: FormGroup;
    @Input() isLoading = false;
    @Output() save = new EventEmitter<void>();
}
