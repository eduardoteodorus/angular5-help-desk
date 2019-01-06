import { ResponseApi } from './../../model/response-api';
import { SharedService } from './../../services/shared.service';
import { Component, OnInit } from '@angular/core';
import { Ticket } from 'src/app/model/ticket.model';
import { ActivatedRoute, Router } from '@angular/router';
import { TicketService } from 'src/app/services/ticket.service';
import { DialogService } from 'src/app/dialog-service';

@Component({
  selector: 'app-ticket-list',
  templateUrl: './ticket-list.component.html',
  styleUrls: ['./ticket-list.component.css']
})
export class TicketListComponent implements OnInit {

  assignedToMe: boolean = false;
  shared: SharedService;
  page: number = 0;
  size: number = 5;
  pages: Array<number>;
  message: {};
  classCss: {};
  listTicket: [];
  ticketFilter = new Ticket(null, null, '', '', '', '', null, null, '', null);

  constructor(
    private dialogService: DialogService,
    private ticketService: TicketService, 
    private router: Router
    ) {
    this.shared = SharedService.getInstance();
   }

  ngOnInit() {
    this.findAll(this.page, this.size);
  }


  findAll(page: number, size: number) {
    this.ticketService.findAll(page, size).subscribe((responseApi: ResponseApi) => {
      this.listTicket = responseApi.data['content'];
      this.pages = new Array(responseApi.data['totalPages']);
    }, err => {
      this.showMessage({
        type: 'error',
        text: err['error']['errors'][0]
      });
    });
  }

  filter(): void {
    this.page = 0;
    this.size = 5;
    this.ticketService.findByParams(this.page, this.size, this.assignedToMe, this.ticketFilter)
      .subscribe((responseApi: ResponseApi) => {
        this.ticketFilter.title = this.ticketFilter.title == 'uninformed' ? '' : this.ticketFilter.title;
        this.ticketFilter.number = this.ticketFilter.number == 0 ? null : this.ticketFilter.number;
       
        this.listTicket = responseApi.data['content'];
        this.pages = new Array(responseApi.data['totalPages']);
      }, err => {
        this.showMessage({
          type: 'error',
          text: err['error']['errors'][0]
        });
      });
  }

  cleanFilter(): void {
    this.assignedToMe = false;
    this.page = 0;
    this.size = 5;
    this.ticketFilter = new Ticket(null, null, '', '', '', '', null, null, '', null);
    this.findAll(this.page, this.size);
  }

  detail(id: string) {
    this.router.navigate(['/ticket-detail', id]);
  }

  edit(id: string) {
    this.router.navigate(['/ticket-new', id]);
  }

  delete(id: string) {
    this.dialogService.confirm('Do you really want to delete this ticket?')
      .then((canDelete: boolean) => {
        if (canDelete) {          
          this.message = {};
          this.ticketService.delete(id).subscribe((responseApi: ResponseApi) => {
            this.showMessage({
              type: 'success',
              text: 'Ticket deleted successfully'
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
}
