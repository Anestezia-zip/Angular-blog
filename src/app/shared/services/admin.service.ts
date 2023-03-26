import { Injectable } from '@angular/core';
import { IBlog, IUser } from 'src/app/blog/blog.component';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private users: Array<IUser> = []
  private blogs: Array<IBlog> = [
    {
      id:1,
      postedBy: 'admin',
      topic: 'First post',
      date: '10:00, 26.03.2023',
      message: 'Sign up to create your account and start to use Angular blog',
    }
  ]


  constructor() { }

  getUsers(): Array<IUser> {
    return this.users;
  }
  getBlogs(): Array<IBlog> {
    return this.blogs;
  }

  addBlog(blog: IBlog): void {
    this.blogs.push(blog)
  }

  updateBlog(index: number, topic: string, message: string): void {
    this.blogs[index].topic = topic;
    this.blogs[index].message = message;
  }
  
  deleteBlog(index: number): void {
    this.blogs.splice(index, 1);
  }  
  
}
