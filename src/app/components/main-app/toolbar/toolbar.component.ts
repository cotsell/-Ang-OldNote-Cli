import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { AccountService } from '../../../service/account.service';
import { IOutputMsg, IProject } from '../../../service/Interface';
import { SysConf } from '../../../service/sysConfig';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
@Input() projectId: string;

@Input() order: EventEmitter<any>;
@Output() output: EventEmitter<any> = new EventEmitter();
orderChild: EventEmitter<any> = new EventEmitter();

  constructor(private aService: AccountService,
              private router: Router,
              private location: Location) { }

  ngOnInit() {
    if (this.order !== undefined && this.order !== null) {
      this.order.subscribe(obs => {
        this.orderChild.emit(obs);
      });
    }
  }

  // For Tesing.
  goback() {
    // this.aService.reset();
    // this.router.navigate(['/']);
    this.location.back();
  }

  receiveRequest(event: IOutputMsg) {
    switch (event.request) {
     case SysConf.GET_PROJECT_LIST_FROM_SERVER :
      this.output.emit(event);
      break;
    }
  }

}
