import { JobOffer } from './job.model';

export type ApplicationStatus = 'Pending' | 'Interview' | 'Rejected' | 'Accepted';

export interface Application {
    id: string;
    jobId: string;
    job: JobOffer;
    status: ApplicationStatus;
    dateApplied: string;
    notes?: string;
    userId: string;
}
