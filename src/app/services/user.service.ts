import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from './../model/user.model';
import { HELPDESK_API } from './helpdesk.api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(user: User) {
      return this.http.post(`${HELPDESK_API}/api/auth`, user);
  }

  createOrUpdate(user: User) {
    if (user.id != null && user.id != '') {
      return this.http.put(`${HELPDESK_API}/api/user`, user);
    } else {
      return this.http.post(`${HELPDESK_API}/api/user`, user);
    }
  }

  findAll(page: number, size: number) {
    return this.http.get(`${HELPDESK_API}/api/auth/${page}/${size}`);
  }

}
