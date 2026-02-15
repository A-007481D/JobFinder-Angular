import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Favorite } from '../models/favorite.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/favoritesOffers`;

    getFavorites(userId: number): Observable<Favorite[]> {
        return this.http.get<Favorite[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addFavorite(favorite: Omit<Favorite, 'id'>): Observable<Favorite> {
        return this.http.post<Favorite>(this.apiUrl, favorite);
    }

    removeFavorite(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
