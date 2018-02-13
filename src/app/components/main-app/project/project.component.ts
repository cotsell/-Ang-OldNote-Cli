import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import { IProject, IOutputMsg, IOrderMsg } from '../../../service/Interface';
import { AccountService } from '../../../service/account.service';
import { SysConf } from '../../../service/sysConfig';
import { StoreInfo, getProjectList } from '../../../service/redux/storeInfo';
import Reducers from '../../../service/redux/reducers';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css']
})
export class ProjectComponent implements OnInit, OnDestroy {
  @Input() projectId: string;
  @Input() isEditable = false;
  @Input() isNewMode = false;
  @Input() order: EventEmitter<IOrderMsg>;
  @Output() output: EventEmitter<any> = new EventEmitter(); // 부모에게 요청할 때 사용해요.
  orderChild: EventEmitter<IOrderMsg> = new EventEmitter(); // 자식 컴포넌트에게 요청할때 사용해요.
  private isTitleEditMode = false;
  private projectSubription: Subscription;
  private displayProject: IProject;
  private _project: IProject = { _id: undefined, title: undefined, writer_id: undefined, num: undefined };
  set project(value) {
    this._project = value;
    this.displayProject = Object.assign({}, value);
  }
  get project() {
    return this._project;
  }

  private titleForm: FormGroup = new FormGroup(
    {
      title: new FormControl()
    }
  );

  constructor(private aService: AccountService,
              private http: HttpClient,
              public store: Store<StoreInfo>) {
    // this.displayProject.title = 'Loading...';
  }

  ngOnInit() {
    // 경우에 따라서는 order를 받지 않기도 해요.
    if (this.order !== undefined && this.order !== null) {
      this.order.subscribe(obs => {
        // 여기서는 할 게 없으므로 MiniMenu에게 그냥 넘겨주기로 해요.
        this.sendClickEventToChild(obs);
      });
    }

    // newMode가 true일때는 구독 할 필요가 없다.
    if (this.isNewMode === false) {
      // 리덕스 구독
      this.projectSubription = this.store.select(getProjectList).subscribe(obs => {
        this.project = obs.find(value => {
          return value._id === this.projectId;
          }
        );
      });
    }
  }

  projectTitleEditMode() {
    this.isTitleEditMode = true;
  }

  saveTitle($event) {
    if ($event['key'] === 'Enter') {
      this.isTitleEditMode = false;
      this.displayProject.title = $event.target.value;
      this.http.put(SysConf.UPDATE_PROJECT + '?' +
                    'key=' + this.aService.getToken(),
                    { _id: this.displayProject._id, title: this.displayProject.title })
        .subscribe(obs => {
          console.log(JSON.stringify(obs));
          this.store.dispatch(new Reducers.project.ModifyAct(this.displayProject));
        });
    }
  }

  focusOn($event) {
    $event.focus();
  }

  // 새로운 Project를 생성하기 위해, 서버에 요청해요.
  sendNewProject($event) {
    if ($event['key'] === 'Enter') {
      // console.log(`TEST: ${this.project} : ${this.aService.getUserInfo().id}`);
      this.project.writer_id = this.aService.getUserInfo().id;
      this.project.title = $event.target.value;
      this.isEditable = false;
      this.http.post(SysConf.INSERT_PROJECT + '?' +
                      'key=' + this.aService.getToken(),
                    this.project)
      .subscribe(obs => {
        // console.log(obs);
        this.store.dispatch(new Reducers.project.AddAct(obs));
      });
    }
  }

  // TODO 삭제 예정. 아직 얽힌 곳이 있어서 보류. 미니메뉴쪽에 다 삭제되면 여기도 삭제.
  refreshProjectList(event) {
    // console.log(`project.component.ts: refreshProjectList(): ${ JSON.stringify(event) }`);
    this.Output({ request: SysConf.GET_PROJECT_LIST_FROM_SERVER });
  }

  // TODO 삭제 예정. refreshProjectList()가 삭제되면 얘도 필요 없겠지.
  Output(msg: IOutputMsg) {
    this.output.emit(msg);
  }

  // TODO 삭제 예정. 모바일에서는 이 기능 사용 불가.
  // Div에 마우스를 올려 놓으면 작은 메뉴버튼을 띄워 주는 함수에요.
  showMiniMenu() {
    this.orderChild.emit({ request: SysConf.SHOW_MINI_MENU_BUTTON });
  }

  // TODO 삭제 예정. 모바일에서는 이 기능 사용 불가.
  // Div에서 마우스를 치우면 작은 메뉴 버튼을 숨겨 주는 함수에요.
  hideMiniMenu() {
    this.orderChild.emit({ request: SysConf.HIDE_MINI_MENU_BUTTON });
  }

  // TODO 삭제 예정. 모바일에서는 이 기능 사용 불가.
  // 화면에 켜져있는 작은 메뉴들을 화면에서 숨겨주는 함수에요.
  sendClickEventToChild(event: IOrderMsg) {
    this.orderChild.emit({ request: event.request, object: event.object });
  }

  ngOnDestroy() {
    if (this.projectSubription !== undefined) {
      this.projectSubription.unsubscribe();
    }
  }

}
