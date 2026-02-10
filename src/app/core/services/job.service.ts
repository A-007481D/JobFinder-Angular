import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { JobOffer } from '../models/job.model';
import { environment } from '../../../environments/environment.development'; // or just environment if aliased, but usually relative path works

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private http = inject(HttpClient);
    private apiUrl = 'https://api.adzuna.com/v1/api/jobs/gb/search/1';
    private appId = environment.adzuna.appId;
    private appKey = environment.adzuna.appKey;

    searchJobs(keywords: string, location: string): Observable<JobOffer[]> {
        const params: any = {
            app_id: this.appId,
            app_key: this.appKey,
            results_per_page: 10,
            what: keywords,
            where: location,
            'content-type': 'application/json'
        };

        return this.http.get<{ results: any[] }>(this.apiUrl, { params }).pipe(
            map(response => response.results.map(job => ({
                id: String(job.id),
                title: job.title,
                company: job.company.display_name,
                location: job.location.display_name,
                description: job.description,
                url: job.redirect_url,
                datePosted: job.created,
                salary: job.salary_min ? `${job.salary_min}-${job.salary_max}` : undefined,
                type: job.contract_time
            }))),
            catchError(error => {
                console.error('API Error', error);
                return of([]);
            })
        );
    }

    getJobById(id: string): Observable<JobOffer | undefined> {
        return of(undefined);
    }
}
