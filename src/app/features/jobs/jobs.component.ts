import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { JobService } from '../../core/services/job.service';
import { AuthService } from '../../core/services/auth.service';
import { JobOffer } from '../../core/models/job.model';
import { SearchComponent } from './search/search.component';
import { ListComponent } from './list/list.component';
import * as FavoritesActions from '../../core/store/favorites/favorites.actions';

@Component({
  selector: 'app-jobs',
  standalone: true,
  imports: [CommonModule, SearchComponent, ListComponent],
  templateUrl: './jobs.component.html',
  styleUrl: './jobs.component.scss'
})
export class JobsComponent {
  private jobService = inject(JobService);
  private authService = inject(AuthService);
  private store = inject(Store);

  jobs: JobOffer[] = [];
  isLoading = false;
  totalResults = 0;
  currentPage = 1;
  hasSearched = false;
  viewMode: 'list' | 'grid' = 'list';

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
    }
  }

  onSearch(criteria: { keywords: string; location: string }) {
    this.currentPage = 1;
    this.searchJobs(criteria.keywords, criteria.location);
  }

  onPageChange(page: number) {
    this.currentPage = page;
    this.searchJobs(this.lastKeywords, this.lastLocation);
  }

  toggleView() {
    this.viewMode = this.viewMode === 'list' ? 'grid' : 'list';
  }

  private lastKeywords = '';
  private lastLocation = '';

  private searchJobs(keywords: string, location: string) {
    this.lastKeywords = keywords;
    this.lastLocation = location;
    this.isLoading = true;
    this.hasSearched = true;
    this.jobService.searchJobs(keywords, location, this.currentPage).subscribe({
      next: (data) => {
        this.jobs = data.jobs;
        this.totalResults = data.totalResults;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
}
