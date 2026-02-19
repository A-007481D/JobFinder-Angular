import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-auth-form-header',
    standalone: true,
    template: `
    <div class="text-center mb-8">
      <div class="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
        <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" [attr.d]="iconPath" />
        </svg>
      </div>
      <h2 class="text-2xl font-bold text-gray-900">{{ title }}</h2>
      <p class="text-gray-500 mt-1">{{ subtitle }}</p>
    </div>
  `
})
export class AuthFormHeaderComponent {
    @Input({ required: true }) title!: string;
    @Input({ required: true }) subtitle!: string;
    @Input() iconPath = 'M21 13.255A23.193 23.193 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
}
