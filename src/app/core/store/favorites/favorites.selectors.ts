import { createFeatureSelector, createSelector } from '@ngrx/store';
import { FavoritesState } from './favorites.reducer';

export const selectFavoritesState = createFeatureSelector<FavoritesState>('favorites');

export const selectAllFavorites = createSelector(
    selectFavoritesState,
    (state: FavoritesState) => state.favorites
);

export const selectFavoritesLoading = createSelector(
    selectFavoritesState,
    (state: FavoritesState) => state.loading
);

export const isFavorite = (jobId: string) => createSelector(
    selectAllFavorites,
    (favorites) => favorites.some(job => job.id === jobId)
);
