import { Ticket } from './../model/ticket.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../model/user.model';
import { HELPDESK_API_TICKET } from './helpdesk.api';

@Injectable({
  providedIn: 'root'
})
export class TicketService {

  constructor(private http: HttpClient) { }


  createOrUpdate(ticket: Ticket) {
    if (ticket.id != null && ticket.id != '') {
      return this.http.put(`${HELPDESK_API_TICKET}`, ticket);
    } else {
      ticket.status = 'NEW';
      return this.http.post(`${HELPDESK_API_TICKET}`, ticket);
    }
  }

  findAll(page: number, size: number) {
    return this.http.get(`${HELPDESK_API_TICKET}/${page}/${size}`);
  }

  findById(id: string) {
    return this.http.get(`${HELPDESK_API_TICKET}/${id}`);
  }

  delete(id: string) {
    return this.http.delete(`${HELPDESK_API_TICKET}/${id}`);
  }

  findByParams(page: number, size: number, assignedToMe: boolean, t: Ticket) {
    t.number = t.number == null? 0 : t.number;
    t.title = t.title == null? 'uninformed' : t.title;
    t.status = t.status == null? 'uninformed' : t.status;
    t.priority = t.priority == null? 'uninformed' : t.priority;

    return this.http.get(`${HELPDESK_API_TICKET}/${page}/${size}/${t.number}/${t.title}/${t.status}/${t.priority}/${assignedToMe}`);
  }

  changeStatus(status: string, ticket: Ticket) {
    return this.http.put(`${HELPDESK_API_TICKET}/${ticket.id}/${status}`, ticket);
  }

  summary() {
    return this.http.get(`${HELPDESK_API_TICKET}/summary`);
  }

}
