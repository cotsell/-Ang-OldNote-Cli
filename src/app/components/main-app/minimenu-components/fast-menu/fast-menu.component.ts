import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg } from '../../../../service/Interface';

@Component({
  selector: 'app-fast-menu',
  templateUrl: './fast-menu.component.html',
  styleUrls: ['./fast-menu.component.css']
})
export class FastMenuComponent implements OnInit {
  @Input() object: What;
  @Output() output: EventEmitter<any> = new EventEmitter();

  constructor(private network: NetworkService) { }

  ngOnInit() {
  }

  deleteObject(event) {
    event.stopPropagation();
    if (this.object.object !== undefined && this.object.object !== null) {
      this.network.deleteFast(this.object.object)
      .subscribe(obs => {
        console.log(obs);
        this.Output({ request: SysConf.GET_FAST_LIST_FROM_SERVER });
      });
    }
  }

  Output(msg: IOutputMsg) {
    this.output.emit(msg);
  }
}
