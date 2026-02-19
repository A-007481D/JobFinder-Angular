import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            let message = 'An unexpected error occurred';

            if (error.status === 0) {
                message = 'Unable to connect to the server';
            } else if (error.status === 401) {
                message = 'Unauthorized access';
            } else if (error.status === 404) {
                message = 'Resource not found';
            } else if (error.status >= 500) {
                message = 'Server error, please try again later';
            }

            console.error(`[HTTP Error] ${error.status}: ${message}`, error);
            return throwError(() => new Error(message));
        })
    );
};
