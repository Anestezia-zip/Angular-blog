import { Component, OnInit } from '@angular/core';
import { AdminService } from '../shared/services/admin.service';
import { LocalStorageService } from 'ngx-webstorage';


@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {

  public users!: IUser[];
  public blogs!: IBlog[];

  public topic!: string;
  public message!: string;


  constructor(
    private adminService: AdminService,
  ) {}

  ngOnInit(): void {
    this.getUsers();
    this.getBlogs();
  }

  getUsers(): void {
    this.users = this.adminService.getUsers();
  }

  getBlogs(): void {
    this.adminService.getAll().subscribe(data => {
      this.blogs = data;
    })
  }

  createUsername!: string;
  createEmail!: string;
  submitEmail!: string;
  createPassword!: string;
  submitPassword!: string;
  alertFields = ''
  alertEmail = ''
  currentUser = ''
  signUpSuccess = true
  empty = ''

  modalSignUp = false
  modalSignIn = false
  modalAddPost = false
  isAdmin = false

  editStatus = false
  editIndex!: number
  editID!: number
  addOrEdit = 'Add post'

  adminEmail = 'admin'
  adminPass = '1234'

  signUp(): void {
    this.modalSignUp = true
    this.createEmail = ''
    this.createPassword = ''
    this.createUsername = ''
  }
  signIn(): void {
    this.empty = ''
    this.submitEmail = ''
    this.submitPassword = ''
    this.modalSignIn = true
  }

  signOut(): void {
    this.signUpSuccess = true;
    this.isAdmin = false
    this.currentUser = ''
  }

  closeModalSignUp(): void {
    this.modalSignUp = false
  }
  closeModalSignIn(): void {
    this.modalSignIn = false
  }

  createUser(): void {
    this.alertFields = ''
    this.alertEmail = ''
    const user = { id: 1, name: this.createUsername, email: this.createEmail, password: this.createPassword };
    this.currentUser = user.name
  
    if (this.createUsername && this.createEmail && this.createPassword) {
      const storedUsers = localStorage.getItem('users');
      if (storedUsers !== null) {
        const parsedUsers = JSON.parse(storedUsers);
        if (parsedUsers && parsedUsers.length > 0) {
          // Есть хотя бы 1 пользователь в localStorage
          this.users = parsedUsers;
        }
      }
      if (!this.users.some(user => user.email.toLowerCase() === this.createEmail.toLowerCase())) {
        const users = JSON.parse(localStorage.getItem('users') || '[]') as IUser[];
        const maxId = users.reduce((acc, cur) => cur.id > acc ? cur.id : acc, 0);
        user.id = maxId + 1;

        this.users.push(user);
        localStorage.setItem('users', JSON.stringify(this.users));
        this.closeModalSignUp()
        this.signUpSuccess = false
      }
      else {
        const email = document.getElementById('email') as HTMLInputElement;
        this.alertEmail = 'This email already exist'
        email.style.border = '1px solid red';
      }

    }
    else this.alertFields = 'Fill out all fields' 
}

submitUser():void {
  let isMatch = false
  if(localStorage.length === 0) {
    this.empty = 'Local Storage is empty'
  }
  const storedUsers = localStorage.getItem('users');
  if (storedUsers !== null) {
    const parsedUsers = JSON.parse(storedUsers);
    for(const arr of parsedUsers) {
      if (arr.email === this.submitEmail && arr.password === this.submitPassword) {
        if (arr.email == this.adminEmail && arr.password == this.adminPass) {
          this.isAdmin = true
        }
        else {
          this.isAdmin = false
        }
        this.empty = ''
        this.currentUser = arr.name
        this.signUpSuccess = false
        this.closeModalSignIn()
        this.submitEmail = ''
        this.submitPassword = ''
        isMatch = true;
        break;
      }
    }
  }

  if (!isMatch) {
    this.empty = 'Incorrect email or password'    
  }
}

openModalAddPost(): void {
  this.modalAddPost = true;
}

closeModalAddPost(): void {
  this.modalAddPost = false;
  this.addOrEdit = 'Add post'
  this.topic = ''
  this.message = ''
}

// addBlog(): void {
//   const currentDate = new Date().toLocaleString('ru-RU', {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'});
//   const newBlog = {
//     id: 1,
//     postedBy: this.currentUser,
//     topic: this.topic,
//     date: currentDate,
//     message: this.message,
//   };
//   if (this.blogs.length > 0) {
//     const id = this.blogs.slice(-1)[0].id;
//     newBlog.id = id + 1;
//   }
//   this.adminService.addBlog(newBlog);
//   this.closeModalAddPost()
//   this.topic = ''
//   this.message = ''
//   this.editStatus = false
// }

addBlog(): void {
  const currentDate = new Date().toLocaleString('ru-RU', {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'});
  const newBlog = {
    postedBy: this.currentUser,
    topic: this.topic,
    date: currentDate,
    message: this.message,
  };

  this.adminService.create(newBlog).subscribe(() => {
    this.getBlogs();
    this.resetForm()
  })
  this.closeModalAddPost()
  this.editStatus = false
}

editBlog(index: number): void {
  this.topic = this.blogs[index].topic
  this.message = this.blogs[index].message
  this.editIndex = index;
  this.editStatus = true
  this.modalAddPost = true
  this.addOrEdit = 'Edit post'
}

// saveBlog():void {
//   const currentDate = new Date().toLocaleString('ru-RU', {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'});
//   const updateBlog = {
//     id: this.editID,
//     postedBy: this.currentUser,
//     topic: this.topic,
//     date: currentDate,
//     message: this.message,
//   };
//   this.adminService.updateBlog(this.editIndex, this.topic, this.message);
//   this.topic = ''
//   this.message = ''
//   this.editStatus = false
//   this.modalAddPost = false
//   this.addOrEdit = 'Add post'
// }

saveBlog():void {
  const currentDate = new Date().toLocaleString('ru-RU', {hour: 'numeric', minute: 'numeric', day: 'numeric', month: 'numeric', year: 'numeric'});
  const updateBlog = {
    id: this.editID,
    postedBy: this.currentUser,
    topic: this.topic,
    date: currentDate,
    message: this.message,
  };
  const id = this.blogs[this.editIndex].id;
  this.adminService.update(updateBlog, id).subscribe(() => {
    this.getBlogs()   
    this.resetForm()
    this.editStatus = false   
  })
  this.modalAddPost = false
  this.addOrEdit = 'Add post'
}

// deleteBlog(index: number): void {
//   this.adminService.deleteBlog(index);
// }

deleteBlog(index: number): void {
  const blog = this.blogs[index];
  const id = blog.id;
  this.adminService.delete(id).subscribe(() => {
    this.getBlogs()      
  })
}

resetForm(): void {
  this.topic = ''
  this.message = ''  
}



}








export interface IUser {
    id: number,
    name: string,
    email: string,
    password: string,
}

export interface IBlog {
  id: number,
  postedBy: string,
  topic: string,
  date: string | number,
  message: string,
}

export interface IBlogRequest {
  postedBy: string,
  topic: string,
  date: string | number,
  message: string,
}

export interface IBlogResponse extends IBlogRequest{
  id: number
}