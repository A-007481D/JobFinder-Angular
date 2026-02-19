import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, map, catchError } from 'rxjs';
import { JobOffer } from '../models/job.model';

@Injectable({
    providedIn: 'root'
})
export class JobService {
    private http = inject(HttpClient);
    private apiUrl = 'https://www.arbeitnow.com/api/job-board-api';

    searchJobs(keywords: string, location: string, page: number = 1): Observable<{ jobs: JobOffer[], totalResults: number }> {
        return this.http.get<{ data: any[], meta: any }>(`${this.apiUrl}?page=${page}`).pipe(
            map(response => {
                const keywordsLower = keywords.toLowerCase();
                const locationLower = location.toLowerCase();

                let filteredJobs = response.data;

                if (keywords) {
                    filteredJobs = filteredJobs.filter(job =>
                        (job.title || '').toLowerCase().includes(keywordsLower)
                    );
                }

                if (location) {
                    filteredJobs = filteredJobs.filter(job =>
                        (job.location || '').toLowerCase().includes(locationLower)
                    );
                }

                filteredJobs.sort((a: any, b: any) =>
                    new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime()
                );

                const jobs: JobOffer[] = filteredJobs.slice(0, 10).map((job: any) => ({
                    id: job.slug || String(Math.random()),
                    title: job.title,
                    company: job.company_name,
                    location: job.location,
                    description: this.stripHtml(job.description || '').substring(0, 200),
                    url: job.url,
                    datePosted: job.created_at,
                    salary: job.salary || undefined,
                    type: job.remote ? 'Remote' : 'On-site'
                }));

                return {
                    jobs,
                    totalResults: filteredJobs.length
                };
            }),
            catchError(() => of({ jobs: [], totalResults: 0 }))
        );
    }

    private stripHtml(html: string): string {
        const tmp = document.createElement('div');
        tmp.innerHTML = html;
        return tmp.textContent || tmp.innerText || '';
    }
}
