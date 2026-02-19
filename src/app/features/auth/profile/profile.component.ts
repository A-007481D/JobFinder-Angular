import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ApplicationService } from '../../../core/services/application.service';
import { ProfileInfoFormComponent } from './profile-info-form/profile-info-form.component';
import { ChangePasswordFormComponent } from './change-password-form/change-password-form.component';
import { Store } from '@ngrx/store';
import { selectAllFavorites } from '../../../core/store/favorites/favorites.selectors';
import * as FavoritesActions from '../../../core/store/favorites/favorites.actions';

@Component({
    selector: 'app-profile',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ProfileInfoFormComponent, ChangePasswordFormComponent],
    templateUrl: './profile.component.html',
    styleUrl: './profile.component.scss'
})
export class ProfileComponent {
    private fb = inject(FormBuilder);
    private applicationService = inject(ApplicationService);
    private store = inject(Store);
    authService = inject(AuthService);

    profileForm = this.fb.group({
        firstName: [this.authService.currentUser()?.firstName || '', Validators.required],
        lastName: [this.authService.currentUser()?.lastName || '', Validators.required],
        email: [this.authService.currentUser()?.email || '', [Validators.required, Validators.email]]
    });

    passwordForm = this.fb.group({
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
    });

    successMessage = '';
    errorMessage = '';
    isLoading = false;
    showDeleteConfirm = false;
    favoritesCount = 0;
    applicationsCount = 0;

    ngOnInit() {
        const user = this.authService.currentUser();
        if (user) {
            this.store.dispatch(FavoritesActions.loadFavorites({ userId: user.id }));
            this.store.select(selectAllFavorites).subscribe(favs => {
                this.favoritesCount = favs.length;
            });
            this.applicationService.getApplications(user.id).subscribe(apps => {
                this.applicationsCount = apps.length;
            });
        }
    }

    get userInitials(): string {
        const user = this.authService.currentUser();
        if (!user) return '?';
        return (user.firstName.charAt(0) + user.lastName.charAt(0)).toUpperCase();
    }

    onUpdateProfile() {
        if (this.profileForm.valid) {
            this.isLoading = true;
            const user = this.authService.currentUser();
            if (!user) return;

            this.authService.updateProfile(user.id, this.profileForm.value as any).subscribe({
                next: () => {
                    this.successMessage = 'Profile updated successfully';
                    this.errorMessage = '';
                    this.isLoading = false;
                    setTimeout(() => this.successMessage = '', 3000);
                },
                error: (err) => {
                    this.errorMessage = err.message || 'Update failed';
                    this.isLoading = false;
                }
            });
        }
    }

    onChangePassword() {
        if (this.passwordForm.valid) {
            if (this.passwordForm.value.newPassword !== this.passwordForm.value.confirmPassword) {
                this.errorMessage = 'Passwords do not match';
                return;
            }

            const user = this.authService.currentUser();
            if (!user) return;

            this.isLoading = true;
            this.authService.updateProfile(user.id, { password: this.passwordForm.value.newPassword! }).subscribe({
                next: () => {
                    this.successMessage = 'Password changed successfully';
                    this.errorMessage = '';
                    this.passwordForm.reset();
                    this.isLoading = false;
                    setTimeout(() => this.successMessage = '', 3000);
                },
                error: (err) => {
                    this.errorMessage = err.message || 'Failed to change password';
                    this.isLoading = false;
                }
            });
        }
    }

    onDeleteAccount() {
        const user = this.authService.currentUser();
        if (!user) return;
        this.authService.deleteAccount(user.id).subscribe();
    }
}
