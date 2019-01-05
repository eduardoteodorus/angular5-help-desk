import { Router } from '@angular/router';
import { UserService } from './../../services/user.service';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { DialogService } from 'src/app/dialog-service';
import { ResponseApi } from 'src/app/model/response-api';


@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {

  page: number = 0;
  size: number = 5;
  pages: Array<number>;
  shared: SharedService;
  message: {};
  classCss: {};
  listUser = [];

  constructor(
    private dialogService: DialogService,
    private userService: UserService,
    private router: Router) { 
      this.shared = SharedService.getInstance();
    }

  ngOnInit() {
    this.findAll(this.page, this.size);
  }

  findAll(page: number, size: number) {
    this.userService.findAll(page, size).subscribe((responseApi: ResponseApi) => {
      this.listUser = responseApi.data['content'];
      this.pages = new Array(responseApi.data['totalPages']);
    }, err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  edit(id: string) {
    this.router.navigate(['/user-new', id]);
  }

  delete(id: string) {
    this.dialogService.confirm('Do you really want to delete this user?')
      .then((canDelete: boolean) => {
        if (canDelete) {          
          this.message = {};
          this.userService.delete(id).subscribe((responseApi: ResponseApi) => {
            this.showMessage({
              type: 'success',
              text: 'User deleted successfully'
            });
            this.findAll(this.page, this.size);
          }, err => {
            this.showMessage({
              type: 'error',
              text: err['error']['errors'][0]
            });
          });
        }
      })
  }

  setNextPage(event: any) {
    event.preventDefault();
    if (this.page + 1 < this.pages.length) {
      this.page = this.page + 1;
      this.findAll(this.page, this.size);
    }
  }

  setPreviousPage(event: any) {
    event.preventDefault();
    if (this.page > 0) {
      this.page = this.page - 1;
      this.findAll(this.page, this.size);
    }
  }

  setPage(i: number, event: any) {
    event.preventDefault();
    this.page = i;
    this.findAll(this.page, this.size);
  }

  private showMessage(message: {type: string, text: string}): void {
    this.message = message;
    this.buildClasses(message.type);
    setTimeout(() => {
      this.message = undefined;      
    }, 3000);
  }
  
  private buildClasses(type: string): void {
    this.classCss = {
      'alert': true
    }
    this.classCss['alert-'+type] = true;
  }

  getFormGroupClass(isInvalid: boolean, isDirty: boolean) : {} {
    return {
      'form-group' : true,
      'has-error' : isInvalid && isDirty,
      'has-success' : !isInvalid && isDirty
    };
  }

}
