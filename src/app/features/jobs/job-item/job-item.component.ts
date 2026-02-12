import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobOffer } from '../../../core/models/job.model';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import * as FavoritesActions from '../../../core/store/favorites/favorites.actions';
import { isFavorite } from '../../../core/store/favorites/favorites.selectors';

@Component({
  selector: 'app-job-item',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './job-item.component.html',
  styleUrl: './job-item.component.scss'
})
export class JobItemComponent implements OnInit {
  @Input({ required: true }) job!: JobOffer;

  private store = inject(Store);
  authService = inject(AuthService);
  private applicationService = inject(ApplicationService);

  isFavorite$!: Observable<boolean>;
  isApplied = false; // Simple local state for demo

  ngOnInit() {
    this.isFavorite$ = this.store.select(isFavorite(this.job.id));
  }

  toggleFavorite() {
    this.isFavorite$.subscribe(isFav => {
    });

  }

  addToFavorites() {
    this.store.dispatch(FavoritesActions.addFavorite({ job: this.job }));
  }

  removeFromFavorites() {
    this.store.dispatch(FavoritesActions.removeFavorite({ jobId: this.job.id }));
  }

  trackApplication() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.applicationService.addApplication({
      jobId: this.job.id,
      job: this.job,
      userId: user.id,
      status: 'Pending',
      dateApplied: new Date().toISOString()
    }).subscribe(() => {
      this.isApplied = true;
      alert('Application tracked successfully!');
    });
  }
}
