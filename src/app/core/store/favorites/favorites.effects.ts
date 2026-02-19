import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { FavoritesService } from '../../services/favorites.service';
import * as FavoritesActions from './favorites.actions';
import { map, mergeMap, switchMap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable()
export class FavoritesEffects {
    private actions$ = inject(Actions);
    private favoritesService = inject(FavoritesService);

    loadFavorites$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.loadFavorites),
            switchMap(action =>
                this.favoritesService.getFavorites(action.userId).pipe(
                    map(favorites => FavoritesActions.loadFavoritesSuccess({ favorites })),
                    catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
                )
            )
        )
    );

    addFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.addFavorite),
            mergeMap(action =>
                this.favoritesService.addFavorite(action.favorite).pipe(
                    map(favorite => FavoritesActions.addFavoriteSuccess({ favorite })),
                    catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
                )
            )
        )
    );

    removeFavorite$ = createEffect(() =>
        this.actions$.pipe(
            ofType(FavoritesActions.removeFavorite),
            mergeMap(action =>
                this.favoritesService.removeFavorite(action.id).pipe(
                    map(() => FavoritesActions.removeFavoriteSuccess({ id: action.id })),
                    catchError(error => of(FavoritesActions.loadFavoritesFailure({ error: error.message })))
                )
            )
        )
    );
}
