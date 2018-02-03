import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg } from '../../../../service/Interface';


@Component({
  selector: 'app-project-menu',
  templateUrl: './project-menu.component.html',
  styleUrls: ['./project-menu.component.css']
})
export class ProjectMenuComponent implements OnInit {
@Input() object: What;
@Output() output: EventEmitter<any> = new EventEmitter();

  constructor(private network: NetworkService) { }

  ngOnInit() {
  }

  deleteObject() {
    this.network.deleteProject(this.object.object)
    .subscribe(obs => {
      // console.log(`minimenu.component.ts: deleteObject(): ${ JSON.stringify(obs) }`);
      this.Output({ request: SysConf.GET_PROJECT_LIST_FROM_SERVER });
    });
  }

  Output(msg: IOutputMsg) {
    this.output.emit(msg);
  }
}
