import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { JobOffer } from '../../../core/models/job.model';
import { selectAllFavorites, selectFavoritesLoading } from '../../../core/store/favorites/favorites.selectors';
import { loadFavorites } from '../../../core/store/favorites/favorites.actions';
import { ListComponent } from '../list/list.component';

@Component({
  selector: 'app-favorites',
  standalone: true,
  imports: [CommonModule, ListComponent],
  templateUrl: './favorites.component.html',
  styleUrl: './favorites.component.scss'
})
export class FavoritesComponent implements OnInit {
  private store = inject(Store);

  favorites$ = this.store.select(selectAllFavorites);
  loading$ = this.store.select(selectFavoritesLoading);

  ngOnInit() {
    // this.store.dispatch(loadFavorites()); 
  }
}
