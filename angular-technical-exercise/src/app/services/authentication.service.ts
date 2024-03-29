﻿import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment.prod';
import { User } from '../models/user.model';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;

    constructor(private http: HttpClient) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        return this.currentUserSubject.value;
    }

    login(email: string, password: string): any {
        return this.http.post<any>(`${environment.apiUrl}/users/authenticate`, { email, password }).pipe(
          map((user: any) => {
              if (user && user.token) {
                  localStorage.setItem('currentUser', JSON.stringify(user));
                  this.currentUserSubject.next(user);
              }

              return user;
            })
        );
    }

    logout(): void {
        localStorage.removeItem('currentUser');
        localStorage.removeItem('tableData');
        this.currentUserSubject.next(null);
    }

    checkIfLoggedIn(): string {
      return localStorage.getItem('currentUser');
  }
}
