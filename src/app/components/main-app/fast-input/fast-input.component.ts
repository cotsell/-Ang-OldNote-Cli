import { Component, OnInit, Input, ViewChild, ElementRef, EventEmitter, Output } from '@angular/core';

import { AccountService } from '../../../service/account.service';
import { NetworkService } from '../../../service/network.service';
import { IProject, IItem, IOutputMsg } from '../../../service/Interface';
import { SysConf } from '../../../service/sysConfig';

@Component({
  selector: 'app-fast-input',
  templateUrl: './fast-input.component.html',
  styleUrls: ['./fast-input.component.scss']
})
export class FastInputComponent implements OnInit {
  @ViewChild('text') textArea: ElementRef;
  @Input() readOnly = false;
  @Input() project: IProject;
  @Input() item: IItem;
  @Input() order: EventEmitter<any>;
  @Input() isFoldPage = false; // FastInput을 접을지 펼칠지를 정하는 변수에요.
  orderChild: EventEmitter<any> = new EventEmitter();

  private isEditTextArea = false;
  private isEditTitle = false;

  private clickFunction: any;

  constructor(private network: NetworkService,
              private aService: AccountService) {
  }

  ngOnInit() {
    // item에 입력값이 없다면 일반 빠른 입력용으로..
    if (this.item === undefined || this.item === null) {
      this.resetItemState();
    } else {
    }
    this.subscribeOrder();
  }

  saveFast() {
    this.saveItemState();
    this.network.insertFast(this.item)
    .subscribe(obs => {
      console.log(obs);
      this.cancelFast();
    });
  }

  cancelFast() {
    this.resetItemState();
    this.isEditTextArea = false;
  }

  saveTitle(event) {
    this.item.title = event.target.value;
    this.isEditTitle = false;
  }

  clickEvent(event) {
    // console.log(`clickEvent() : `, event);

    if (this.clickFunction !== undefined && this.clickFunction !== null) {
      this.clickFunction();
    } else {
      this.closeAllMode();
    }
    this.clickFunction = undefined;
  }

  doNothing() {
    this.clickFunction = () => {};
  }

  private saveItemState() {
    this.item.text = this.textArea.nativeElement.value;
  }

  private resetItemState() {
    this.item = {};
    this.item.project_id = this.project._id;
    this.item.writer_id = this.aService.getUserInfo().id;
    this.item.text = '';
    this.item.title = '';
    this.item.tags = [];
  }

  private receiveTagList(event) {
    this.item.tags = event;
  }

  private changeTextAreaMode() {
    // console.log(`changeTextAreaMode()`);
    this.clickFunction = () => {
      this.closeAllMode();
      this.isEditTextArea = true;
    };
  }

  private changeTitleMode(event) {
    event.stopPropagation();
    // console.log(`changeTitleMode()`);
    this.clickFunction = () => {
      this.closeAllMode();
      this.isEditTitle = true;
    };
    this.clickEvent(event);
  }

  private changeFoldPage(event) {
    // console.log(`changeFoldPageMode()`);
    this.clickFunction = () => {
      this.closeAllMode();
      this.isFoldPage = !this.isFoldPage;
    };
  }

  private closeAllMode() {
    this.isEditTitle = false;
    // this.isEditTextArea = false;
  }

  private showMiniMenu() {
    this.orderChild.emit({ request: SysConf.SHOW_MINI_MENU_BUTTON });
  }

  private hideMiniMenu() {
    this.orderChild.emit({ request: SysConf.HIDE_MINI_MENU_BUTTON });
  }

  private subscribeOrder() {
    if (this.order !== undefined && this.order !== null) {
      this.order.subscribe(obs => {
        // console.log('tttttt', obs);
        this.orderChild.emit(obs);
        this.clickEvent(obs.object);
      });
    }
  }

}
