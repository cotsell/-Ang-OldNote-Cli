import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg } from '../../../../service/Interface';
import { StoreInfo } from '../../../../service/redux/storeInfo';
import { RemoveAct } from '../../../../service/redux/reducers/itemListReducer';

@Component({
  selector: 'app-item-menu',
  templateUrl: './item-menu.component.html',
  styleUrls: ['./item-menu.component.css']
})
export class ItemMenuComponent implements OnInit {
  @Input() object: What;
  @Output() output: EventEmitter<any> = new EventEmitter();

  constructor(private network: NetworkService,
              private store: Store<StoreInfo>) { }

  ngOnInit() {
  }

  deleteObject(event) {
    this.network.deleteItem(this.object.object)
    .subscribe(obs => {
      // console.log(obs);
      this.store.dispatch(new RemoveAct(obs) );
    });
  }

  Output(msg: IOutputMsg) {
    this.output.emit(msg);
  }
}
