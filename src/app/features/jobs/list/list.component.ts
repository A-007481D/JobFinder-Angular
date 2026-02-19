import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { JobOffer } from '../../../core/models/job.model';
import { JobItemComponent } from '../job-item/job-item.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [CommonModule, JobItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent {
  @Input() jobs: JobOffer[] = [];
  @Input() isLoading = false;
  @Input() totalResults = 0;
  @Input() currentPage = 1;
  @Input() hasSearched = false;
  @Input() viewMode: 'list' | 'grid' = 'list';
  @Output() pageChange = new EventEmitter<number>();
  @Output() viewModeChange = new EventEmitter<'list' | 'grid'>();

  get totalPages(): number {
    return Math.ceil(this.totalResults / 10);
  }

  get visiblePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 2);
    const end = Math.min(this.totalPages, this.currentPage + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  }

  goToPage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.pageChange.emit(page);
    }
  }
}
