import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = 'https://jsonplaceholder.typicode.com/posts';

  constructor(private http: HttpClient) { }

  getPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getAllPosts(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }
  getUserPostsByUserId(userId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}?userId=${userId}`);
  }
  getPostById(postId: number): Observable<any> {
    const url = `${this.apiUrl}/${postId}`;
    return this.http.get<any>(url);
  }
  
  

  getCommentsForPost(postId: number): Observable<any[]> {
    const url = `https://jsonplaceholder.typicode.com/posts/${postId}/comments`;
    return this.http.get<any[]>(url);
  }

}
