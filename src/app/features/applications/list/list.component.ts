import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ApplicationService } from '../../../core/services/application.service';
import { AuthService } from '../../../core/services/auth.service';
import { Application } from '../../../core/models/application.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-application-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './list.component.html',
  styleUrl: './list.component.scss'
})
export class ListComponent implements OnInit {
  private applicationService = inject(ApplicationService);
  private authService = inject(AuthService);

  applications$!: Observable<Application[]>;

  ngOnInit() {
    const user = this.authService.currentUser();
    if (user) {
      this.applications$ = this.applicationService.getApplications(user.id);
    }
  }
}
