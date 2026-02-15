import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { routes } from './app.routes';
import { favoritesReducer } from './core/store/favorites/favorites.reducer';
import { FavoritesEffects } from './core/store/favorites/favorites.effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withFetch()),
    provideStore({ favorites: favoritesReducer }),
    provideEffects([FavoritesEffects])
  ]
};
