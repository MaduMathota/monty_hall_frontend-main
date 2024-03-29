import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class MontyHallService {
  private apiUrl = 'https://localhost:7088/api/MontyHallPuzzle/Simulation'; 

  constructor(private http: HttpClient) { }
  
  runMontyHallSimulations(simulations: number, changeDoor: boolean): Observable<any> {
    return this.http.get(`${this.apiUrl}/Montyhall`, {
      params: { simulations: simulations.toString(), changeDoor: changeDoor.toString() }
    });
  }


}
