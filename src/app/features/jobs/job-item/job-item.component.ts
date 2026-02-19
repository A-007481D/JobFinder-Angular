import { Component, Input, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobOffer } from '../../../core/models/job.model';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import * as FavoritesActions from '../../../core/store/favorites/favorites.actions';
import { selectIsFavorite, selectFavoriteByOfferId } from '../../../core/store/favorites/favorites.selectors';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-job-item',
  standalone: true,
  imports: [CommonModule, RelativeTimePipe],
  templateUrl: './job-item.component.html',
  styleUrl: './job-item.component.scss'
})
export class JobItemComponent implements OnInit {
  @Input({ required: true }) job!: JobOffer;

  private store = inject(Store);
  authService = inject(AuthService);
  private applicationService = inject(ApplicationService);

  isFavorite$!: Observable<boolean>;
  isApplied = false;

  ngOnInit() {
    this.isFavorite$ = this.store.select(selectIsFavorite(this.job.id));
  }

  toggleFavorite() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.store.select(selectFavoriteByOfferId(this.job.id)).pipe(take(1)).subscribe(fav => {
      if (fav) {
        this.store.dispatch(FavoritesActions.removeFavorite({ id: fav.id! }));
      } else {
        this.store.dispatch(FavoritesActions.addFavorite({
          favorite: {
            userId: user.id,
            offerId: this.job.id,
            title: this.job.title,
            company: this.job.company,
            location: this.job.location
          }
        }));
      }
    });
  }

  trackApplication() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.applicationService.addApplication({
      userId: user.id,
      offerId: this.job.id,
      apiSource: 'arbeitnow',
      title: this.job.title,
      company: this.job.company,
      location: this.job.location,
      url: this.job.url,
      status: 'en_attente',
      notes: '',
      dateAdded: new Date().toISOString()
    }).subscribe(() => {
      this.isApplied = true;
    });
  }

  openExternalUrl() {
    window.open(this.job.url, '_blank');
  }
}
