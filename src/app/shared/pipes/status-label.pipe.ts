import { Pipe, PipeTransform } from '@angular/core';
import { ApplicationStatus } from '../../core/models/application.model';

@Pipe({
    name: 'statusLabel',
    standalone: true
})
export class StatusLabelPipe implements PipeTransform {
    private labels: Record<ApplicationStatus, string> = {
        'en_attente': 'En attente',
        'accepte': 'Accepté',
        'refuse': 'Refusé'
    };

    transform(value: ApplicationStatus): string {
        return this.labels[value] || value;
    }
}
