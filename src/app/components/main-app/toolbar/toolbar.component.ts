import { Component, OnInit } from '@angular/core';
import { AccountService } from '../../../service/account.service';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {

  constructor(private aService: AccountService) { } 

  ngOnInit() {
  }

}
