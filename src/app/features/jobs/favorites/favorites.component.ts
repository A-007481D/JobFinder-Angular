import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Favorite } from '../../../core/models/favorite.model';
import { AuthService } from '../../../core/services/auth.service';
import { selectAllFavorites, selectFavoritesLoading } from '../../../core/store/favorites/favorites.selectors';
import * as FavoritesActions from '../../../core/store/favorites/favorites.actions';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store);
  private authService = inject(AuthService);

  favorites$: Observable<Favorite[]> = this.store.select(selectAllFavorites);
  loading$: Observable<boolean> = this.store.select(selectFavoritesLoading);

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
    }
  }

  removeFavorite(id: number) {
    this.store.dispatch(FavoritesActions.removeFavorite({ id }));
  }
}
