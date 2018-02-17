import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg, IItem } from '../../../../service/Interface';
import { StoreInfo } from '../../../../service/redux/storeInfo';
import { RemoveAct } from '../../../../service/redux/reducers/fastListReducer';
@Component({
  selector: 'app-fast-menu',
  templateUrl: './fast-menu.component.html',
  styleUrls: ['./fast-menu.component.css']
})
export class FastMenuComponent implements OnInit {
  @Input() object: What;

  constructor(private network: NetworkService,
              private store: Store<StoreInfo>) { }

  ngOnInit() {
    // console.log(JSON.stringify(this.object.object));
  }

  deleteObject(event) {
    event.stopPropagation();
    if (this.object.object !== undefined && this.object.object !== null) {
      this.network.deleteFast(this.object.object)
      .subscribe(obs => {
        // console.log(obs);
        const temp: IItem[] = [this.object.object];
        this.store.dispatch(new RemoveAct(temp));
      });
    }
  }

}
