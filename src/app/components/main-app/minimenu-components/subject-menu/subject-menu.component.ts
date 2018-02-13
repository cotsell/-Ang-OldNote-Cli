import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Store } from '@ngrx/store';

import { What } from '../../minimenu/minimenu.component';
import { NetworkService } from '../../../../service/network.service';
import { SysConf } from '../../../../service/sysConfig';
import { IOutputMsg, ISubject } from '../../../../service/Interface';
import { StoreInfo } from '../../../../service/redux/storeInfo';
import Reducers from '../../../../service/redux/reducers/';

@Component({
  selector: 'app-subject-menu',
  templateUrl: './subject-menu.component.html',
  styleUrls: ['./subject-menu.component.css']
})
export class SubjectMenuComponent implements OnInit {
  @Input() object: What;
  @Output() output: EventEmitter<any> = new EventEmitter();

  constructor(private network: NetworkService,
              private store: Store<StoreInfo>) { }

  ngOnInit() {
  }

  deleteObject() {
    this.network.deleteSubject(this.object.object)
    .subscribe(obs => {
      // console.log(`${ JSON.stringify(obs) }`);
      if (obs.subject !== undefined) {
        const subject: ISubject[] = [];
        subject.push(obs.subject);
        this.store.dispatch(new Reducers.itemList.RemoveBySubjectIdAct(obs.subject._id));
        this.store.dispatch(new Reducers.subject.RemoveAct(subject));
      }
    });
  }

  // TODO 삭제 예정
  Output(msg: IOutputMsg) {
    this.output.emit(msg);
  }
}
