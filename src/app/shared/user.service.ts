import { Injectable } from '@angular/core';
import { User } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  actualUser = new User()

  constructor() { }

  setUser(user: User){
    this.actualUser = user;
  }

  getUser(){
    return this.actualUser
  }
}
