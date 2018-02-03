import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SysConf } from '../../../service/sysConfig';
import { AccountService } from '../../../service/account.service';
import { Subject } from 'rxjs/Subject';
import { ISubject, IProject, IOrderMsg } from '../../../service/Interface';

@Component({
  selector: 'app-subject',
  templateUrl: './subject.component.html',
  styleUrls: ['./subject.component.css']
})
export class SubjectComponent implements OnInit {
  @Input() subject: ISubject = {};
  @Input() project: IProject = {};
  @Input() isNewMode = false;
  @Input() order: EventEmitter<IOrderMsg>;
  @Output() output: EventEmitter<any> = new EventEmitter();
  orderChild: EventEmitter<IOrderMsg> = new EventEmitter();
  private isEditTitle = false;

  constructor(private http: HttpClient,
              private aService: AccountService) { }

  ngOnInit() {
    if (this.order !== undefined && this.order !== null) {
      this.order.subscribe(obs => {
        // console.log(obs);
        this.sendClickEventToChild(obs);
      });
    }
  }

  // 화면에서 서브젝트의 타이틀을 변경할 때 사용되는 함수.
  saveTitle($event) {
    if ($event['key'] === 'Enter') {
      console.log($event);
      this.subject.title = $event.target.value;
      this.isEditTitle = false;
      this.http.put(SysConf.UPDATE_SUBJECT + '?' +
                    'key=' + this.aService.getToken(),
                    { _id: this.subject._id, title: this.subject.title })
      .subscribe(obs => {
        console.log(obs);
      });
    }
  }

  receiveOutput($event) {
    this.output.emit($event);
  }

  focusOn($event) {
    $event.focus();
  }

  sendNewSubject($event) {
    if ($event['key'] === 'Enter') {
      this.isEditTitle = false;
      this.subject.project_id = this.project._id;
      this.subject.writer_id = this.aService.getUserInfo().id;
      this.subject.title = $event.target.value;

      this.http.post(SysConf.INSERT_SUBJECT + '?' +
                      'key=' + this.aService.getToken(),
                      this.subject)
      .subscribe(obs => {
        console.log(obs);
        this.output.emit({request: SysConf.GET_SUBJECT_LIST_FROM_SERVER});
      });
    }
  }

  sendClickEventToChild(event: IOrderMsg) {
    this.orderChild.emit({ request: event.request, object: event.object });
  }

  showMiniMenuButton() {
    this.orderChild.emit({ request: SysConf.SHOW_MINI_MENU_BUTTON });
  }

  hideMiniMenuButton() {
    this.orderChild.emit({ request: SysConf.HIDE_MINI_MENU_BUTTON });
  }
}
