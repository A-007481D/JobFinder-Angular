import { createAction, props } from '@ngrx/store';
import { JobOffer } from '../../models/job.model';

export const loadFavorites = createAction(
    '[Favorites] Load Favorites'
);

export const loadFavoritesSuccess = createAction(
    '[Favorites] Load Favorites Success',
    props<{ favorites: JobOffer[] }>()
);

export const loadFavoritesFailure = createAction(
    '[Favorites] Load Favorites Failure',
    props<{ error: any }>()
);

export const addFavorite = createAction(
    '[Favorites] Add Favorite',
    props<{ job: JobOffer }>()
);

export const removeFavorite = createAction(
    '[Favorites] Remove Favorite',
    props<{ jobId: string }>()
);
