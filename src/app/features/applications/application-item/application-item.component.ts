import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
    selector: 'app-application-item',
    standalone: true,
    imports: [CommonModule, FormsModule, StatusLabelPipe, RelativeTimePipe],
    template: `
    <div class="glass-card-hover p-5">
      <!-- Top row: title + status -->
      <div class="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
        <div class="flex items-start gap-3 min-w-0 flex-1">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
            [ngClass]="{
              'bg-amber-50 border-amber-200': application.status === 'en_attente',
              'bg-emerald-50 border-emerald-200': application.status === 'accepte',
              'bg-red-50 border-red-200': application.status === 'refuse'
            }">
            <svg *ngIf="application.status === 'en_attente'" class="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg *ngIf="application.status === 'accepte'" class="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
            <svg *ngIf="application.status === 'refuse'" class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="min-w-0">
            <h3 class="text-[15px] font-semibold text-gray-900 truncate">{{ application.title }}</h3>
            <p class="text-sm text-gray-500 mt-0.5">{{ application.company }} · {{ application.location }}</p>
            <p class="text-xs text-gray-400 mt-1">Added {{ application.dateAdded | relativeTime }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <select [ngModel]="application.status" (ngModelChange)="statusChange.emit({ app: application, status: $event })"
            class="text-xs bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 text-gray-700 focus:outline-none focus:border-teal-500 cursor-pointer">
            <option value="en_attente">En attente</option>
            <option value="accepte">Accepté</option>
            <option value="refuse">Refusé</option>
          </select>
        </div>
      </div>

      <!-- Notes section -->
      <div class="mt-3 pt-3 border-t border-gray-100">
        <div *ngIf="!isEditingNotes" class="flex items-start justify-between gap-3">
          <p class="text-sm leading-relaxed" [ngClass]="application.notes ? 'text-gray-600' : 'text-gray-400 italic'">
            {{ application.notes || 'No notes added' }}
          </p>
          <button (click)="isEditingNotes = true" class="btn-icon flex-shrink-0" title="Edit notes">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"/>
            </svg>
          </button>
        </div>
        <div *ngIf="isEditingNotes">
          <textarea [(ngModel)]="application.notes" rows="2"
            class="input-field text-sm mb-2" placeholder="Add personal notes..."></textarea>
          <div class="flex gap-2">
            <button (click)="onSaveNotes()" class="btn-primary text-xs py-1.5 px-3">Save</button>
            <button (click)="isEditingNotes = false" class="btn-glass text-xs py-1.5 px-3">Cancel</button>
          </div>
        </div>
      </div>

      <!-- Bottom actions -->
      <div class="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-gray-100">
        <a [href]="application.url" target="_blank" class="btn-glass text-xs py-1.5 px-3 inline-flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
          View Offer
        </a>
        <button (click)="delete.emit(application)" class="btn-icon text-red-400 hover:text-red-600 hover:bg-red-50" title="Delete">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
          </svg>
        </button>
      </div>
    </div>
  `
})
export class ApplicationItemComponent {
    @Input({ required: true }) application!: Application;
    @Output() statusChange = new EventEmitter<{ app: Application; status: ApplicationStatus }>();
    @Output() notesSave = new EventEmitter<Application>();
    @Output() delete = new EventEmitter<Application>();

    isEditingNotes = false;

    onSaveNotes() {
        this.notesSave.emit(this.application);
        this.isEditingNotes = false;
    }
}
