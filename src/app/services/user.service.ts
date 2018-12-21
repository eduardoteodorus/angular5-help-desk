import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../model/user.model';
import { HELPDESK_API_AUTH, HELPDESK_API_USER } from './helpdesk.api';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  login(user: User) {
      return this.http.post(`${HELPDESK_API_AUTH}`, user);
  }

  createOrUpdate(user: User) {
    if (user.id != null && user.id != '') {
      return this.http.put(`${HELPDESK_API_USER}`, user);
    } else {
      return this.http.post(`${HELPDESK_API_USER}`, user);
    }
  }

  findAll(page: number, size: number) {
    return this.http.get(`${HELPDESK_API_USER}/${page}/${size}`);
  }

  findById(id: string) {
    return this.http.get(`${HELPDESK_API_USER}/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`${HELPDESK_API_USER}/${id}`);
  }



}
