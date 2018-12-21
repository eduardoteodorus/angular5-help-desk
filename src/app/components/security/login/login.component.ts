import { CurrentUser } from './../../../model/current-user.model';
import { UserService } from './../../../services/user.service';
import { SharedService } from './../../../services/shared.service';
import { User } from './../../../model/user.model';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  user = new User('', '', '', '');
  shared: SharedService;
  message: string;

  constructor(private userService: UserService, private router: Router) {
    this.shared = SharedService.getInstance();
   }

  ngOnInit() {
  }

  login() {
    this.message = '';
    this.userService.login(this.user).subscribe((authUser: CurrentUser) => {
      this.shared.token = authUser.token;
      this.shared.user = authUser.user;
      this.shared.user.profile = this.shared.user.profile.substring(5);
      this.shared.showTemplate.emit(true);
      this.router.navigate(['/']);
    }, err => {
      this.shared.token = null;
      this.shared.user = null;
      this.shared.showTemplate.emit(false);
      this.message = 'Error';
    });
  }

  logout() {
    this.message = '';
    this.user =  new User('', '', '', '');
    this.shared.showTemplate.emit(false);
    window.location.href = '/login';
    window.location.reload();
  }

  getFormGroupClass(isInvalid: boolean, isDirty: boolean) : {} {
    return {
      'form-group' : true,
      'has-error' : isInvalid && isDirty,
      'has-success' : !isInvalid && isDirty
    };
  }

}
