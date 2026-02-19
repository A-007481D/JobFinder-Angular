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
    <div class="glass-card-hover p-6">
      <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          <h3 class="text-base font-semibold text-gray-900">{{ application.title }}</h3>
          <div class="flex flex-wrap items-center gap-2 mt-1">
            <span class="text-sm text-gray-500">{{ application.company }}</span>
            <span class="text-gray-300">•</span>
            <span class="text-sm text-gray-500">{{ application.location }}</span>
          </div>
          <p class="text-xs text-gray-400 mt-1">Added {{ application.dateAdded | relativeTime }}</p>
        </div>

        <div class="flex items-center gap-3">
          <select [ngModel]="application.status" (ngModelChange)="statusChange.emit({ app: application, status: $event })"
            class="bg-white border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-800 focus:outline-none focus:border-teal-500 cursor-pointer">
            <option value="en_attente">En attente</option>
            <option value="accepte">Accepté</option>
            <option value="refuse">Refusé</option>
          </select>
          <span [ngClass]="{
            'badge-warning': application.status === 'en_attente',
            'badge-success': application.status === 'accepte',
            'badge-danger': application.status === 'refuse'
          }">{{ application.status | statusLabel }}</span>
        </div>
      </div>

      <div class="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
        <div class="flex-1">
          <div *ngIf="!isEditingNotes" class="text-sm text-gray-500">
            <span *ngIf="application.notes">{{ application.notes }}</span>
            <span *ngIf="!application.notes" class="text-gray-400 italic">No notes</span>
          </div>
          <textarea *ngIf="isEditingNotes" [(ngModel)]="application.notes" rows="2"
            class="input-field text-sm" placeholder="Add personal notes..."></textarea>
        </div>

        <div class="flex items-center gap-2 flex-shrink-0">
          <button *ngIf="!isEditingNotes" (click)="isEditingNotes = true" class="btn-glass text-xs py-1.5 px-3">Edit Notes</button>
          <button *ngIf="isEditingNotes" (click)="onSaveNotes()" class="btn-primary text-xs py-1.5 px-3">Save</button>
          <button *ngIf="isEditingNotes" (click)="isEditingNotes = false" class="btn-glass text-xs py-1.5 px-3">Cancel</button>
          <a [href]="application.url" target="_blank" class="btn-glass text-xs py-1.5 px-3">View Offer</a>
          <button (click)="delete.emit(application)" class="btn-danger text-xs py-1.5 px-3">Delete</button>
        </div>
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
