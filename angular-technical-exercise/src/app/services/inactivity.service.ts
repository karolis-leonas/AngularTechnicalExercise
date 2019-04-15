import { ApplicationConstants } from './../constants/application-constants';
import { Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InactivityService {
  private _timerHandle: any = null;
  private _logoutSubject = new Subject<void>();

  constructor() { }

  startChecking() {
    this.resetTimer();

    window.onload = this.resetTimer.bind(this);
    document.onmousemove = this.resetTimer.bind(this);
    document.onkeypress = this.resetTimer.bind(this);
  }

  stopChecking() {
      if (this._timerHandle) {
          clearTimeout(this._timerHandle);
          this._timerHandle = null;
      }
  }

  getTimeoutObservable(): Observable<any> {
    return this._logoutSubject.asObservable();
  }

  private resetTimer() {
      if (this._timerHandle) {
          clearTimeout(this._timerHandle);
          this._timerHandle = null;
      }

      this._timerHandle = setTimeout(this.logout.bind(this), ApplicationConstants.TimeoutDuration);
  }

  private logout() {
    this._logoutSubject.next();
  }
}
