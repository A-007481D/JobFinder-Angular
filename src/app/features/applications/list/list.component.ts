import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { ApplicationItemComponent } from '../application-item/application-item.component';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, ApplicationItemComponent],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);

  applications: Application[] = [];
  isLoading = true;

  ngOnInit() {
    this.loadApplications();
  }

  loadApplications() {
    const user = this.authService.currentUser();
    if (!user) return;

    this.isLoading = true;
    this.applicationService.getApplications(user.id).subscribe({
      next: (apps) => {
        this.applications = apps;
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }

  onStatusChange(event: { app: Application; status: ApplicationStatus }) {
    if (!event.app.id) return;
    this.applicationService.updateStatus(event.app.id, event.status).subscribe(() => {
      event.app.status = event.status;
    });
  }

  onNotesSave(app: Application) {
    if (!app.id) return;
    this.applicationService.updateNotes(app.id, app.notes).subscribe();
  }

  onDelete(app: Application) {
    if (!app.id) return;
    this.applicationService.deleteApplication(app.id).subscribe(() => {
      this.applications = this.applications.filter(a => a.id !== app.id);
    });
  }
}
