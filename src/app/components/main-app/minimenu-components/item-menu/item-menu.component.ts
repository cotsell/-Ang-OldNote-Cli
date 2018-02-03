import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg } from '../../../../service/Interface';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.css']
})
export class ItemMenuComponent implements OnInit {
  @Input() object: What;
  @Output() output: EventEmitter<any> = new EventEmitter();

  constructor(private network: NetworkService) { }

  ngOnInit() {
  }

  deleteObject() {
    this.network.deleteItem(this.object.object)
    .subscribe(obs => {
      // console.log(obs);
      this.Output({ request: SysConf.GET_SUBJECT_LIST_FROM_SERVER });
    });
  }

  Output(msg: IOutputMsg) {
    this.output.emit(msg);
  }
}
