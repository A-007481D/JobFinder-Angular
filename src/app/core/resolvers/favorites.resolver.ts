import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { Store } from '@ngrx/store';
import { Actions, ofType } from '@ngrx/effects';
import { take, map } from 'rxjs';
import { AuthService } from '../services/auth.service';
import * as FavoritesActions from '../store/favorites/favorites.actions';

export const favoritesResolver: ResolveFn<boolean> = () => {
    const store = inject(Store);
    const actions$ = inject(Actions);
    const authService = inject(AuthService);

    const user = authService.currentUser();
    if (user) {
        store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
        return actions$.pipe(
            ofType(FavoritesActions.loadFavoritesSuccess, FavoritesActions.loadFavoritesFailure),
            take(1),
            map(() => true)
        );
    }
    return true;
};
