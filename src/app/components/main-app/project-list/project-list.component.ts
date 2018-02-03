import { Component, OnInit, EventEmitter } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AccountService } from '../../../service/account.service';
import { SysConf } from '../../../service/sysConfig';
import { IOrderMsg } from '../../../service/Interface';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.css']
})
export class ProjectListComponent implements OnInit {
  projectList;
  orderChild: EventEmitter<IOrderMsg> = new EventEmitter();

  constructor(private aService: AccountService,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.loadProjectList();
  }


  private loadProjectList() {
    this.http.get(SysConf.GET_PROJECT_LIST + '?' +
                  'key=' + this.aService.getToken() + '&' +
                  'id=' + this.aService.getUserInfo()['id'])
    .subscribe(obs => {
      // console.log(obs);
      this.projectList = obs;
    });
  }

  private receiveRequest($event) {
    // console.log(`project-list.components.ts: receiveRequest(): ${ JSON.stringify($event) }`);
    if ($event['request'] === SysConf.GET_PROJECT_LIST_FROM_SERVER) {
      this.loadProjectList();
    }
  }

  // 화면에 켜져있는 작은 메뉴들을 화면에서 숨겨주는 함수에요.
  private orderChildEvent(event) {
    // this.orderChild.emit({ request: SysConf.CLOSE_LAYER, object: event });
    this.orderChild.emit({ request: SysConf.CLICK_EVENT, object: event });
    // console.log(`test`);
  }
}
