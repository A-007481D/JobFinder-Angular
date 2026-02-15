import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application, ApplicationStatus } from '../../../core/models/application.model';
import { StatusLabelPipe } from '../../../shared/pipes/status-label.pipe';
import { RelativeTimePipe } from '../../../shared/pipes/relative-time.pipe';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, FormsModule, StatusLabelPipe, RelativeTimePipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);

  applications: Application[] = [];
  isLoading = true;
  editingNotesId: number | null = null;

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

  updateStatus(app: Application, status: ApplicationStatus) {
    if (!app.id) return;
    this.applicationService.updateStatus(app.id, status).subscribe(() => {
      app.status = status;
    });
  }

  toggleNotesEdit(appId: number) {
    this.editingNotesId = this.editingNotesId === appId ? null : appId;
  }

  saveNotes(app: Application) {
    if (!app.id) return;
    this.applicationService.updateNotes(app.id, app.notes).subscribe(() => {
      this.editingNotesId = null;
    });
  }

  deleteApplication(app: Application) {
    if (!app.id) return;
    this.applicationService.deleteApplication(app.id).subscribe(() => {
      this.applications = this.applications.filter(a => a.id !== app.id);
    });
  }
}
