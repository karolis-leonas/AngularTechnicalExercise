import { Injectable } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlertService {
    private successfulSubject = new Subject<any>();
    private errorSubject = new Subject<any>();

    private keepAfterNavigationChange = false;

    constructor(private router: Router) {
        // clear alert message on route change
        router.events.subscribe(event => {
            if (event instanceof NavigationStart) {
                if (this.keepAfterNavigationChange) {
                    // only keep for a single location change
                    this.keepAfterNavigationChange = false;
                } else {
                    this.successfulSubject.next();
                    this.errorSubject.next();
                }
            }
        });
    }

    success(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        let successfulObject = { type: 'success', text: message };
        console.log(successfulObject);
        this.successfulSubject.next({ type: 'success', text: message });
    }

    error(message: string, keepAfterNavigationChange = false) {
        this.keepAfterNavigationChange = keepAfterNavigationChange;
        let errorObject = { type: 'error', text: message };
        this.errorSubject.next(errorObject);
    }

    getSuccessMessage(): Observable<any> {
      return this.successfulSubject.asObservable();
    }

    getErrorMessage(): Observable<any> {
        return this.errorSubject.asObservable();
    }
}
