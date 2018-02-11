import { Component, OnInit, OnDestroy, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import * as marked from 'marked';
import * as prism from 'prismjs';
import { Observable } from 'rxJs';
import { Store } from '@ngrx/store';

import { GaterService } from '../../../service/gater.service';
import { SysConf } from '../../../service/sysConfig';
import { AccountService } from '../../../service/account.service';
import { NetworkService } from '../../../service/network.service';
import { IItem } from '../../../service/Interface';
import * as StoreInfo from '../../../service/redux/storeInfo';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  itemId;
  _item: IItem;
  displayItem: IItem;
  tags: string[] = [];
  fastList: IItem[];
  orderChild: EventEmitter<any> = new EventEmitter();
  isEditText = false;
  isEditTitle = false;

  @ViewChild('target') target: ElementRef;
  @ViewChild('MyTextarea') textArea: ElementRef;
  @ViewChild('MyTitle') title: ElementRef;

  set item(value) {
    this._item = value;
    this.displayItem = Object.assign({}, value);
    this.change();
  }
  get item() {
    return this._item;
  }

  textForm: FormGroup = new FormGroup(
    {
      textarea: new FormControl()
    }
  );

  titleForm: FormGroup = new FormGroup(
    {
      title: new FormControl()
    }
  );

  constructor(private router: ActivatedRoute,
              private http: HttpClient,
              private aService: AccountService,
              private network: NetworkService,
              private store: Store<StoreInfo.StoreInfo>) {
    this.itemId = router.snapshot.params['id'];
    this.settingMakred();
  }

  ngOnInit() {
    this.network.getItem(this.itemId)
    .subscribe(obs => {
      this.item = obs;
      this.getFast(); // TODO: 임시로 여기에 있긴 한데, 차후 다른 위치로 옮겨질지도 몰라요.
    });
    // 태그를 가져옵니다.
    this.network.getTags({ writer_id: this.aService.getUserInfo().id })
    .subscribe(obs => {
      // TODO :: This is test code. Delete or change this code afger testing.
      for (let i = 0; obs.length > i; i++) {
        this.tags.push(obs[i].title);
      }
      // TODO :: End.
    });
  }

  // Textarea의 내용을 수정하기 위해 서버에 전달해요.
  // Textarea의 내용은 <textarea>내에서 줄바꿈을 할 수 있어야 하므로,
  // 엔터를 눌렀을 때 수정하지 않고, 따로 수정 버튼을 누르도록 정했어요.
  saveText(ref) {
    this.item = Object.assign({}, this.item, { text: ref.value });
    this.isEditText = false;
    console.log(this.textForm);
    this.http.put(SysConf.UPDATE_ITEM + '?' +
                  'key=' + this.aService.getToken()
                  , { _id: this.item._id, text: this.item.text })
    .subscribe(obs => { console.log(JSON.stringify(obs)); });
  }

  // title의 내용을 수정하기 위해 서버에 전달합니다.
  // title의 내용은 <input>에서 엔터키를 누르면 수정을 시행해요.
  saveTitle($event) {
    if ($event['key'] === 'Enter') {
      this.item.title = $event.target.value;
      this.isEditTitle = false;
      this.http.put(SysConf.UPDATE_ITEM + '?' +
                    'key=' + this.aService.getToken(),
                    { _id: this.item._id, title: this.item.title })
      .subscribe(obs => { console.log(JSON.stringify(obs)); });
      // console.log(this.item['title']);
    }
  }

  // Tag Component로부터 output되는 TagList를 받아와요.
  receiveTagList($event) {
    console.log($event);
    this.item.tags = $event;
    this.http.put(SysConf.UPDATE_ITEM + '?' +
                  'key=' + this.aService.getToken(),
                  { _id: this.item._id, tags: this.item.tags })
    .subscribe(obs => {
      console.log(obs);
    });
  }

  // 해당 item의 tag와 project_id를 참조해서, FastInput들을 가져와요.
  getFast() {
    this.network.getFast({
        project_id: this.item.project_id,
        tags: this.item.tags
      }
    )
    .subscribe(obs => {
        console.log(obs);
        this.fastList = obs;
      }
    );
  }

  // -----------------------------------------------------------------------
  // Events
  // -----------------------------------------------------------------------

  // <input>엘리먼트에 포커스를 줍니다.
  focusOnElement($event) {
    $event.focus();
    // console.log($event);
  }

  // 빈 공간을 클릭했을 시에 발생하는 이벤트 처리.
  focusOutManage($event) {
    this.isEditText = false;
    this.isEditTitle = false;
    this.clickEvent($event);
  }

  // 자식 컴포넌트들에게 클릭이벤트 전달해요.
  private clickEvent(event) {
    this.orderChild.emit({ request: SysConf.CLICK_EVENT, object: event });
  }

  private clickedTitle(evnet) {
    event.stopPropagation();
    this.isEditTitle = true;
    this.isEditText = false;
    setTimeout(() => this.title.nativeElement.focus(), 0);
    this.clickEvent(event);
  }

  private clickedText(event) {
    event.stopPropagation();
    this.isEditText = true;
    this.isEditTitle = false;
    setTimeout(() => this.textArea.nativeElement.focus(), 0);
    this.clickEvent(event);
  }

  private clickedEditingTitle(event) {
    event.stopPropagation();
    this.isEditText = false;
    this.clickEvent(event);
  }

  private clickedEditingText(event) {
    event.stopPropagation();
    this.isEditTitle = false;
    this.clickEvent(event);
  }

  // 차일드로부터 이벤트를 받아서 처리해요.
  private receiveOutput(event) {
    console.log(`item-detail.component.ts: receiveOutput(): `, event);
    switch (event.request) {
      case SysConf.GET_FAST_LIST_FROM_SERVER :
        console.log(`item-detail.component.ts: receiveOutput(): getFast()`, event.request);
        this.getFast();
        break;
    }
  }

  // -----------------------------------------------------------------------
  // MarkDown
  // -----------------------------------------------------------------------
  private settingMakred() {
    marked.setOptions({
      renderer: new marked.Renderer(),
      gfm: true,
      tables: true,
      breaks: true,
      pedantic: false,
      sanitize: true,
      smartLists: true,
      smartypants: false,
      xhtml: false
    });
  }

  private parseMarkdownToHtml(text: string) {
    const myRenderer = new marked.Renderer();
    myRenderer.blockquote = function (value): string {
      return '<blockquote style="margin: 10px !important;">' + value + '</blockquote>';
    };
    // myRenderer.code = function (value, language): string {
    //   return `<pre style="white-space: pre;"><code class="language-${language}">${value}</code></pre>`;
    //   // return `<pre style="white-space: pre;" class="language-${language}">${value}</pre>`;
    // };
    // console.log(marked(text, { renderer: myRenderer }));
    return marked(text, { renderer: myRenderer });
  }

  change() {
    this.target.nativeElement.innerHTML = this.item.text ? this.parseMarkdownToHtml(this.item.text) : 'Click here To insert new text.';
    prism.highlightAllUnder(this.target.nativeElement);
  }

  ngOnDestroy() {
  }
}






// -----------------------------------------------------------------------
// <div id="main_grid" (click)="focusOutManage($event)">
//   <!-- toolbar -->
//   <div id="toolbar_grid">
//     <app-toolbar></app-toolbar>
//   </div>
//   <!-- Fast Mini List -->
//   <div>
//     <app-fast-minilist
//       [fastList]="fastList"
//       [order]="orderChild"
//       (output)="receiveOutput($event)">
//     </app-fast-minilist>
//   </div>

//   <!-- Item Detail -->
//   <div id="item_detail_div">
//     <!-- Title -->
//     <div style="margin-bottom: 14px;">
//       <!-- 타이틀 수정 화면 -->
//       <div [hidden]="!isEditTitle">
//         <form [formGroup]="titleForm">
//           <input
//             #MyTitle
//             name="title"
//             class="title_input_text"
//             type="text"
//             [formControlName]="'title'"
//             [value]="item?.title"
//             (keypress)="saveTitle($event)"
//             (click)="clickedEditingTitle($event)"
//             >
//         </form>
//       </div>
//       <!-- 타이틀 기본 표시 화면 -->
//       <div [hidden]="isEditTitle">
//           <a
//             id="title_text"
//             name="title"
//             (click)="clickedTitle();"
//             >
//             {{ item?.title }}
//           </a>
//       </div>
//     </div>
//     <!-- Textarea -->
//     <div>
//       <!-- 내용 수정 화면 -->
//       <div [hidden]="!isEditText">
//         <form [formGroup] = "textForm" >
//           <textarea
//             #MyTextarea
//             name="text"
//             class="text_area"
//             [class.text_area]="true"
//             [formControlName]="'textarea'"
//             [value]="item?.text ? item.text : ''"
//             (click)="clickedEditingText($event)"
//             ></textarea><br>
//           <button class="save_button"
//                   (click)="saveText(MyTextarea)">Save</button>
//         </form>
//       </div>
//       <!-- 내용 기본 화면 -->
//       <div [hidden]="isEditText" style="word-break: break-all;">
//         <span #target
//           (click)="clickedText($event)"
//           name="text"
//           >
//         </span>
//       </div>
//     </div>
//     <!-- Tag -->
//     <div>
//       <app-tag
//         [tagList]="item?.tags"
//         (outTagList)="receiveTagList($event)">
//       </app-tag>
//     </div>
//   </div>

//   <!-- Right empty space -->
//   <div></div>
// </div>
