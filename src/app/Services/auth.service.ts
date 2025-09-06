import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { WebRequestService } from './web-request.service';
import { Router } from '@angular/router';
import { catchError, map, shareReplay, tap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private webService: WebRequestService, private router: Router, private http: HttpClient) { }

  login(email: string, password: string) {
    return this.webService.login(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token') ?? '',
          res.headers.get('x-refresh-token') ?? ''
        );
        console.log('LOGGED IN!');
      })
    );
  }

  signup(email: string, password: string) {
    return this.webService.signup(email, password).pipe(
      shareReplay(),
      tap((res: HttpResponse<any>) => {
        // the auth tokens will be in the header of this response
        this.setSession(
          res.body._id,
          res.headers.get('x-access-token') ?? '',
          res.headers.get('x-refresh-token') ?? ''
        );
        console.log('Successfully signed up and now logged in!');
      })
    );
  }

  logout() {
    this.removeSession();

    this.router.navigate(['/login']);
  }

  getAccessToken() {
    return localStorage.getItem('x-access-token');
  }

  getRefreshToken() {
    return localStorage.getItem('x-refresh-token');
  }

  getUserId() {
    return localStorage.getItem('user-id');
  }

  setAccessToken(accessToken: string) {
    localStorage.setItem('x-access-token', accessToken)
  }
  
  private setSession(userId: string, accessToken: string, refreshToken: string) {
    localStorage.setItem('user-id', userId);
    localStorage.setItem('x-access-token', accessToken);
    localStorage.setItem('x-refresh-token', refreshToken);
    console.log('Session set:', { userId, accessToken, refreshToken });
  }
  

  private removeSession() {
    localStorage.removeItem('user-id');
    localStorage.removeItem('x-access-token');
    localStorage.removeItem('x-refresh-token');
  }

  getNewAccessToken(): Observable<void> {
    const refreshToken = this.getRefreshToken();
    const userId = this.getUserId();
  
    // Check for empty values and handle gracefully
    if (!refreshToken || !userId) {
      console.error('Missing refresh token or user ID.');
      return of(); // Return an empty observable to handle the missing token scenario
    }
  
    return this.http
      .get(`${this.webService.ROOT_URL}/users/me/access-token`, {
        headers: {
          'x-refresh-token': refreshToken,
          _id: userId,
        },
        observe: 'response',
      })
      .pipe(
        tap((res: HttpResponse<any>) => {
          const newAccessToken = res.headers.get('x-access-token');
          if (newAccessToken) {
            this.setAccessToken(newAccessToken);
            console.log('Access token updated successfully.');
          } else {
            console.error('Failed to retrieve new access token.');
          }
        }),
        catchError((error) => {
          console.error('Error fetching new access token:', error);
          return of(); // Return an empty observable on error
        }),
        map(() => undefined) // Transform the result to match the void type
      );
  }  

  isAuthenticated(): Observable<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return of(false); // No access token means not authenticated
    }
  
    // Call an endpoint to check token validity
    return this.http.get(`${this.webService.ROOT_URL}/auth/verify-token`, {
      headers: { 'x-access-token': accessToken },
      observe: 'response'
    }).pipe(
      map(res => res.status === 200),
      catchError(() => of(false))
    );
  }
  
  isTokenValid(): Observable<boolean> {
    const accessToken = this.getAccessToken();
    if (!accessToken) {
      return of(false); // No access token means not authenticated
    }

    // Call an endpoint to check token validity
    return this.http.get(`${this.webService.ROOT_URL}/auth/verify-token`, {
      headers: { 'x-access-token': accessToken },
      observe: 'response'
    }).pipe(
      map(res => res.status === 200),
      catchError(() => of(false))
    );
  }
}