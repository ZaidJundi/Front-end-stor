import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { GovernmentDto } from './models';

@Injectable({
  providedIn: 'root'
})
export class GovernmentService {
  private BASE_API_URL = "https://localhost:7120/api/";
  private Government_API_URL = "Government";

  constructor(private http: HttpClient) { }

  getGovernments(): Observable<GovernmentDto[]> {
    return this.http.get<GovernmentDto[]>(`${this.BASE_API_URL}${this.Government_API_URL}`).pipe(
      catchError(error => {
        console.error('Error fetching governments:', error);
        return of([]);
      })
    );
  }



  addGovernment(government: GovernmentDto): Observable<GovernmentDto> {
    return this.http.post<GovernmentDto>(`${this.BASE_API_URL}${this.Government_API_URL}`, government);
  }
  updateGovernment(governmentId: string, government: GovernmentDto): Observable<GovernmentDto> {
    return this.http.put<GovernmentDto>(`${this.BASE_API_URL}${this.Government_API_URL}/${governmentId}`, government);
  }


  deleteGovernment(governmentId: string): Observable<GovernmentDto> {
    return this.http.delete<GovernmentDto>(`${this.BASE_API_URL}${this.Government_API_URL}/${governmentId}`);
  }
}
