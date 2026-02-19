import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Favorite } from '../../../../core/models/favorite.model';

@Component({
    selector: 'app-favorite-item',
    standalone: true,
    imports: [CommonModule],
    template: `
    <div class="glass-card-hover p-6">
      <div class="flex items-center justify-between gap-4">
        <div class="flex items-center gap-3 min-w-0 flex-1">
          <div class="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center flex-shrink-0 border border-teal-200">
            <span class="text-sm font-bold text-teal-600">{{ favorite.company.charAt(0) || 'J' }}</span>
          </div>
          <div class="min-w-0">
            <h3 class="text-base font-semibold text-gray-900 truncate">{{ favorite.title }}</h3>
            <p class="text-sm text-gray-500">{{ favorite.company }} • {{ favorite.location }}</p>
          </div>
        </div>
        <button (click)="remove.emit(favorite.id!)" class="btn-danger text-xs py-1.5 px-3 flex items-center gap-1.5 flex-shrink-0">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Remove
        </button>
      </div>
    </div>
  `
})
export class FavoriteItemComponent {
    @Input({ required: true }) favorite!: Favorite;
    @Output() remove = new EventEmitter<number>();
}
