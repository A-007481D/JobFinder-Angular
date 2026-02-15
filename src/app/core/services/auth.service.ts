import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, map, throwError, switchMap } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = `${environment.apiUrl}/users`;

  currentUser = signal<User | null>(this.getUserFromStorage());

  private getUserFromStorage(): User | null {
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  register(user: Omit<User, 'id'>): Observable<User> {
    return this.checkEmailExists(user.email).pipe(
      switchMap(exists => {
        if (exists) {
          return throwError(() => new Error('Cet email existe déjà'));
        }
        return this.http.post<User>(this.apiUrl, user);
      })
    );
  }

  private checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}`).pipe(
      map(users => users.length > 0)
    );
  }

  login(email: string, password: string, rememberMe: boolean = false): Observable<User> {
    return this.http.get<User[]>(`${this.apiUrl}?email=${email}&password=${password}`).pipe(
      map(users => {
        if (users.length === 0) {
          throw new Error('Email ou mot de passe invalide');
        }
        const user = users[0];
        const { password: _, ...userWithoutPassword } = user;
        this.storeUser(userWithoutPassword as User, rememberMe);
        return userWithoutPassword as User;
      })
    );
  }

  logout(): void {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  updateProfile(userId: number, data: Partial<User>): Observable<User> {
    return this.http.patch<User>(`${this.apiUrl}/${userId}`, data).pipe(
      map(updatedUser => {
        const { password: _, ...safe } = updatedUser;
        this.currentUser.set(safe as User);
        const storage = localStorage.getItem('user') ? localStorage : sessionStorage;
        storage.setItem('user', JSON.stringify(safe));
        return updatedUser;
      })
    );
  }

  deleteAccount(userId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${userId}`).pipe(
      map(() => {
        this.logout();
      })
    );
  }

  private storeUser(user: User, rememberMe: boolean): void {
    this.currentUser.set(user);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
