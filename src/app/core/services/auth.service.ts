import { Injectable, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, map, of, catchError, throwError, switchMap } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private apiUrl = 'http://localhost:3000/users';

  // Signal to track current user state
  currentUser = signal<User | null>(this.getUserFromStorage());

  constructor() { }

  private getUserFromStorage(): User | null {
    const userStr = sessionStorage.getItem('user') || localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  register(user: Omit<User, 'id'>): Observable<User> {
    return this.checkEmailExists(user.email).pipe(
      switchMap(exists => {
        if (exists) {
          return throwError(() => new Error('Email already exists'));
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
          throw new Error('Invalid email or password');
        }
        const user = users[0];
        // Remove password before storing
        const { password, ...userWithoutPassword } = user;
        this.storeUser(userWithoutPassword, rememberMe);
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

  private storeUser(user: any, rememberMe: boolean): void {
    this.currentUser.set(user);
    const storage = rememberMe ? localStorage : sessionStorage;
    storage.setItem('user', JSON.stringify(user));
  }

  isAuthenticated(): boolean {
    return !!this.currentUser();
  }
}
