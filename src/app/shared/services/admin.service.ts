import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IBlog, IBlogRequest, IBlogResponse, IUser } from 'src/app/blog/blog.component';
import { environment } from 'src/environments/environment.prod';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private users: Array<IUser> = []

  private url = environment.BACKEND_URL;
  private api = { blogs: `${this.url}/blogs` }

  constructor(
    private http: HttpClient
  ) { }

  getUsers(): Array<IUser> {
    return this.users;
  }

  getAll(): Observable<IBlogResponse[]> {
    return this.http.get<IBlogResponse[]>(this.api.blogs);
  }

  create(blog: IBlogRequest): Observable<IBlogResponse> {
    return this.http.post<IBlogResponse>(this.api.blogs, blog);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api.blogs}/${id}`);
  }

  update(blog: IBlogRequest, id: number): Observable<IBlogResponse> {
    return this.http.patch<IBlogResponse>(`${this.api.blogs}/${id}`, blog);
  }
  
}
