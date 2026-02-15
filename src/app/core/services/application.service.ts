import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Application, ApplicationStatus } from '../models/application.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private http = inject(HttpClient);
    private apiUrl = `${environment.apiUrl}/applications`;

    getApplications(userId: number): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addApplication(application: Omit<Application, 'id'>): Observable<Application> {
        return this.http.post<Application>(this.apiUrl, application);
    }

    updateStatus(id: number, status: ApplicationStatus): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
    }

    updateNotes(id: number, notes: string): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, { notes });
    }

    deleteApplication(id: number): Observable<void> {
        return this.http.delete<void>(`${this.apiUrl}/${id}`);
    }
}
