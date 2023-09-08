import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Movies} from '../model/movies';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CrudService {

  serviceURL : string;

  constructor(private http : HttpClient) { 
    this.serviceURL = "http://springmoviescollection-production.up.railway.app/api/movies"
  }

  addMovies(movies : Movies) : Observable<Movies> {
    return this.http.post<Movies>(this.serviceURL+'/insert', movies);
  }

  getAllMovies() : Observable<Movies[]> {
    return this.http.get<Movies[]>(this.serviceURL);
  }

  deleteMovies(movies : Movies) : Observable<Movies> {
    return this.http.delete<Movies>(this.serviceURL+'/'+movies.id);
  }

  editMovies(movies : Movies) : Observable<Movies> {
    return this.http.put<Movies>(this.serviceURL+'/'+movies.id, movies);
  }

  searchMovies(movies : Movies): Observable<Movies[]> {
    return this.http.get<Movies[]>(this.serviceURL+"/search/"+movies.title);
  }

  updateMovies(movies : Movies) : Observable<Movies> {
    return this.http.post<Movies>(this.serviceURL+'/update', movies);
  }  
}
