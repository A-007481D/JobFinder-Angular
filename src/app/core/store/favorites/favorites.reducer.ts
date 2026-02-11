import { createReducer, on } from '@ngrx/store';
import { JobOffer } from '../../models/job.model';
import * as FavoritesActions from './favorites.actions';

export interface FavoritesState {
    favorites: JobOffer[];
    error: any;
    loading: boolean;
}

export const initialState: FavoritesState = {
    favorites: [],
    error: null,
    loading: false
};

export const favoritesReducer = createReducer(
    initialState,
    on(FavoritesActions.loadFavorites, state => ({ ...state, loading: true })),
    on(FavoritesActions.loadFavoritesSuccess, (state, { favorites }) => ({
        ...state,
        favorites,
        loading: false
    })),
    on(FavoritesActions.loadFavoritesFailure, (state, { error }) => ({
        ...state,
        error,
        loading: false
    })),
    on(FavoritesActions.addFavorite, (state, { job }) => {
        // Prevent duplicates
        if (state.favorites.some(f => f.id === job.id)) {
            return state;
        }
        return {
            ...state,
            favorites: [...state.favorites, job]
        };
    }),
    on(FavoritesActions.removeFavorite, (state, { jobId }) => ({
        ...state,
        favorites: state.favorites.filter(job => job.id !== jobId)
    }))
);
