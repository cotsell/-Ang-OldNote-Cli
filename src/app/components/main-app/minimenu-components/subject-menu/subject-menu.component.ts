import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg } from '../../../../service/Interface';


@Component({
  selector: 'app-subject-menu',
  templateUrl: './subject-menu.component.html',
  styleUrls: ['./subject-menu.component.css']
})
export class SubjectMenuComponent implements OnInit {
  @Input() object: What;
  @Output() output: EventEmitter<any> = new EventEmitter();

  constructor(private network: NetworkService) { }

  ngOnInit() {
  }

  deleteObject() {
    this.network.deleteSubject(this.object.object)
    .subscribe(obs => {
      // console.log(`minimenu.component.ts: deleteObject(): ${ JSON.stringify(obs) }`);
      this.Output({ request: SysConf.GET_SUBJECT_LIST_FROM_SERVER });
    });
  }

  Output(msg: IOutputMsg) {
    this.output.emit(msg);
  }
}
