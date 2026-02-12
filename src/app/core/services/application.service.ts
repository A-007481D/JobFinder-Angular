import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Application } from '../models/application.model';
import { JobOffer } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class ApplicationService {
    private http = inject(HttpClient);
    private apiUrl = 'http://localhost:3000/applications'; 

    getApplications(userId: string): Observable<Application[]> {
        return this.http.get<Application[]>(`${this.apiUrl}?userId=${userId}`);
    }

    addApplication(application: Omit<Application, 'id'>): Observable<Application> {
        
        return this.http.post<Application>(this.apiUrl, application);
    }

    updateStatus(id: string, status: string): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, { status });
    }

    updateNotes(id: string, notes: string): Observable<Application> {
        return this.http.patch<Application>(`${this.apiUrl}/${id}`, { notes });
    }
}
