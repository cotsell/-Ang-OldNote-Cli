import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { AccountService } from '../../../service/account.service';
import { SysConf } from '../../../service/sysConfig';
import { IItem, IOutputMsg, IOrderMsg, IProject, ISubject } from '../../../service/Interface';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  @Input() item;
  @Input() isNewItem = false;
  @Input() project: IProject;
  @Input() subject: ISubject;
  @Input() order: EventEmitter<IOrderMsg>;
  @Output() output: EventEmitter<any> = new EventEmitter();
  orderChild: EventEmitter<IOrderMsg> = new EventEmitter();
  private isInsertMode = false;

  constructor(private http: HttpClient,
              private aService: AccountService) { }

  ngOnInit() {
    if (this.order !== undefined && this.order !== null) {
      this.order.subscribe(obs => {
        const msg: IOrderMsg = obs;
        // console.log(`item.component.ts: ngOnInit(): obs is`);
        // console.log(obs);
        if (msg.request === SysConf.CLICK_EVENT) {
          this.orderChild.emit(obs);
        }
      });
    }
  }

  // 새로운 Item을 입력하기 위해, 서버로 저장 요청하는 함수에요.
  sendNewItem($event) {
    if ($event.key === 'Enter') {
      const newItem: IItem = {  project_id: this.project._id,
                                subject_id: this.subject._id,
                                title: $event.target.value,
                                writer_id: this.aService.getUserInfo
                                ().id
                              };
      this.isInsertMode = false;
      // console.log(newItem);
      this.http.post(SysConf.INSERT_ITEM + '?' +
                      'key=' + this.aService.getToken(),
                      newItem)
      .subscribe(obs => {
        // console.log(obs);
        this.Output({request: SysConf.GET_SUBJECT_LIST_FROM_SERVER});
      });
    }
  }

  Output(object: IOutputMsg) {
    this.output.emit(object);
  }

  focusOn(element) {
    element.focus();
  }

  orderShowMiniMenuButton() {
    this.orderChild.emit({ request: SysConf.SHOW_MINI_MENU_BUTTON });
  }

  orderHideMiniMenuButton() {
    this.orderChild.emit({ request: SysConf.HIDE_MINI_MENU_BUTTON });
  }

}
