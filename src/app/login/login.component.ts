import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { User } from '../shared/user.model';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  actualUser: User = new User();
  validatedUser: User = new User();

  constructor(private router: Router,private toastr: ToastrService, private userService: UserService) { }

  ngOnInit(): void {
  }

  validate(login){
    this.actualUser.username = login.value.username;                    //lekérjük az megadott nevet/jelszót
    this.actualUser.password = login.value.password;

    if(localStorage.getItem(this.actualUser.username) != null){         //ellenőrizzük, hogy van-e már ilyen
      this.validatedUser = JSON.parse(localStorage.getItem(this.actualUser.username));
      if(this.validatedUser.password == this.actualUser.password){      //van már ilyen felhasználó ezzel a jelszóval továb engedjük 
        this.userService.setUser(this.validatedUser)
        this.router.navigate(['/crypto'])
      }
      else{                                                             //ha van ilyen felhasználó, más jelszóval jelezzük
        this.toastr.error("Már van ilyen felhasználó másik jelszóval", "Rossz jelszó")
      }
    }
    else{                                                               //ha új felhasználó, beengedjük és mentjük az adatot
      localStorage.setItem(this.actualUser.username, JSON.stringify(this.actualUser));
      this.router.navigate(['/crypto'])
    }
  }
}
