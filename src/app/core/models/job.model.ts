export interface JobOffer {
    id: string;
    title: string;
    company: string;
    location: string;
    description: string;
    url: string;
    datePosted: string;
    salary?: string;
    type?: string;
}
