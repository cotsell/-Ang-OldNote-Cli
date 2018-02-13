import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg } from '../../../../service/Interface';
import { StoreInfo } from '../../../../service/redux/storeInfo';
import Reducers from '../../../../service/redux/reducers';


@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.css']
})
export class ProjectMenuComponent implements OnInit {
@Input() object: What;

  constructor(private network: NetworkService,
              private store: Store<StoreInfo>) { }

  ngOnInit() {
  }

  deleteObject() {
    this.network.deleteProject(this.object.object)
    .subscribe(obs => {
      console.log(obs);
      if (obs.project !== undefined) {
        this.store.dispatch(new Reducers.project.RemoveAct(obs.project));
      }
    });
  }
}
