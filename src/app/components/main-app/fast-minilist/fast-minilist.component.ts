import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { IItem } from '../../../service/Interface';
import { SysConf } from '../../../service/sysConfig';

@Component({
  selector: 'app-fast-minilist',
  templateUrl: './fast-minilist.component.html',
  styleUrls: ['./fast-minilist.component.css']
})
export class FastMinilistComponent implements OnInit {
  @Input() fastList: IItem[];
  @Input() order: EventEmitter<any>;
  orderChild: EventEmitter<any> = new EventEmitter();

  constructor() { }

  ngOnInit() {
    this.subscribeOrder();
  }

  subscribeOrder() {
    if (this.order !== undefined && this.order !== null) {
      this.order.subscribe(obs => {
        // console.log('tttt', obs);
        this.orderChild.emit(obs);
      });
    }
  }

}
