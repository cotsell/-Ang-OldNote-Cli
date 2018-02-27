import { Component, OnInit, OnDestroy, OnChanges, EventEmitter, ViewChild, SimpleChanges,
          ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import * as marked from 'marked';
import * as prism from 'prismjs';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxJs';

import { GaterService } from '../../../service/gater.service';
import { SysConf } from '../../../service/sysConfig';
import { AccountService } from '../../../service/account.service';
import { NetworkService } from '../../../service/network.service';
import { IItem, IUiState, ICheckbox } from '../../../service/Interface';
import * as StoreInfo from '../../../service/redux/storeInfo';
import * as ItemDetailRedux from '../../../service/redux/reducers/itemDetailReducer';
import * as ComponentUiReducer from '../../../service/redux/reducers/componentUiReducer';
import * as FastRedux from '../../../service/redux/reducers/fastListReducer';
import { uuid } from '../../../service/utils';

class UI {
  value: IUiState;

  constructor() {
    this.value = { id: uuid(), state: { isEditText: false, isEditTitle: false }};
  }

  getClone(state: any) {
    return Object.assign({}, this.value, { state: Object.assign({}, this.value.state, state ) });
  }
}

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnDestroy, OnChanges {
  tags:             string[]          = []; // 사용 용도 불명;;
  orderChild:       EventEmitter<any> = new EventEmitter();
  ui                                  = new UI();
  _item:            IItem;
  displayItem:      IItem;
  subscription:     Subscription;
  fastSubscription: Subscription;
  uiSubscriptions:  Subscription;
  fastList:         IItem[];
  itemId;

  @ViewChild('target')      target:   ElementRef;
  @ViewChild('MyTextarea')  textArea: ElementRef;
  @ViewChild('MyTitle')     title:    ElementRef;

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

  constructor(private router:   ActivatedRoute,
              private http:     HttpClient,
              private aService: AccountService,
              private network:  NetworkService,
              private store:    Store<StoreInfo.StoreInfo>) {
    this.itemId = router.snapshot.params['id'];
    this.settingMakred();
  }

  ngOnInit() {
    // console.log(`Item-Detail ngOnItit()`);
    // 리덕스에 컴포넌트의 UI를 생성.
    this.store.dispatch(new ComponentUiReducer.AddComponentAct(this.ui.value));
    this.uiSubscriptions = this.store.select(StoreInfo.getComponentUi)
      .subscribe(obs => {
        this.ui.value = obs.find(value => {
          return value.id === this.ui.value.id ? true : false;
        });
      });

    // 리덕스 스토어를 구독 시작합니다.
    this.subscription = this.store.select(StoreInfo.getItemDetail)
      .subscribe(obs => {
        this.item = obs;
        // console.log(`REDUX: ${JSON.stringify(obs)}`);
      });
    this.fastSubscription = this.store.select(StoreInfo.getFastList)
      .subscribe(obs => {
        this.fastList = obs;
      });

    // 아이템의 내용을 서버에 요청합니다.
    this.network.getItem(this.itemId)
    .subscribe(obs => {
      this.store.dispatch(new ItemDetailRedux.AddAct(obs));
      // this.store.dispatch(new CheckboxListRedux.AddListAct(obs.checkbox_list));
      setTimeout(() => { this.getFast(); }, 1000);    // TODO: 임시로 여기에 있긴 한데, 차후 다른 위치로 옮겨질지도 몰라요.
    });

    // 태그를 가져옵니다. !! 아직 사용 용도 불명..
    this.network.getTags({ writer_id: this.aService.getUserInfo().id })
    .subscribe(obs => {
      // TODO :: This is test code. Delete or change this code after testing.
      for (let i = 0; obs.length > i; i++) {
        this.tags.push(obs[i].title);
      }
      // TODO :: End.
    });
  }

  ngOnChanges(changes: SimpleChanges) {}

  // Textarea의 내용을 수정하기 위해 서버에 전달해요.
  // Textarea의 내용은 <textarea>내에서 줄바꿈을 할 수 있어야 하므로,
  // 엔터를 눌렀을 때 수정하지 않고, 따로 수정 버튼을 누르도록 정했어요.
  saveText(ref) {
    // this.item = Object.assign({}, this.item, { text: ref.value });
    this.displayItem.text = ref.value;

    this.store.dispatch(new ComponentUiReducer.ModifyComponentAct(
      this.ui.getClone({ isEditText: false })));

    this.http.put(
      SysConf.UPDATE_ITEM + '?' +
      'key=' + this.aService.getToken(),
      {
        _id: this.displayItem._id,
        text: this.displayItem.text
      })
    .subscribe(obs => {
      // console.log(JSON.stringify(obs));
      this.store.dispatch(new ItemDetailRedux.ModifyAct(this.displayItem));
    });
  }

  // title의 내용을 수정하기 위해 서버에 전달합니다.
  // title의 내용은 <input>에서 엔터키를 누르면 수정을 시행해요.
  saveTitle($event) {
    if ($event['key'] === 'Enter') {
      this.displayItem.title = $event.target.value;

      this.store.dispatch(new ComponentUiReducer.ModifyComponentAct(
        this.ui.getClone({ isEditTitle: false })));

      this.http.put(
        SysConf.UPDATE_ITEM + '?' +
        'key=' + this.aService.getToken(),
        {
          _id: this.displayItem._id,
          title: this.displayItem.title
        })
      .subscribe(obs => {
        // console.log(JSON.stringify(obs));
        this.store.dispatch(new ItemDetailRedux.ModifyAct(this.displayItem));
      });
    }
  }

  // Tag Component로부터 output되는 TagList를 받아와요.
  receiveTagList(event) {
    // console.log($event);
    this.displayItem.tags = event;
    this.http.put(
      SysConf.UPDATE_ITEM + '?' +
      'key=' + this.aService.getToken(),
      {
        _id: this.displayItem._id,
        tags: this.displayItem.tags
      })
    .subscribe(obs => {
      // console.log(obs);
      this.store.dispatch(new ItemDetailRedux.ModifyAct(this.displayItem));
    });
  }

  // 해당 item의 tag와 project_id를 참조해서, FastInput들을 가져와요.
  getFast() {
    // console.log(`TEST: ${this.displayItem.project_id}`);
    // console.log(`TEST: ${this.displayItem.tags}`);
    this.network.getFast({
        project_id: this.displayItem.project_id,
        tags: this.displayItem.tags
      })
    .subscribe(obs => {
        // console.log(obs);
        // this.fastList = obs;
        this.store.dispatch(new FastRedux.AddAct(obs));
      }
    );
  }

  // -----------------------------------------------------------------------
  // 차일드 컴포넌트용 리덕스, 네트워크 컨트롤 함수
  // -----------------------------------------------------------------------

  handleNewItem = (item: ICheckbox) => {
    // console.log(`handleNewItem() on!!`);
    const LIST = {
      list: [...this.displayItem.checkbox_list.list, item]
    };

    const CHECKBOX_LIST = {
      checkbox_list: Object.assign(
        {},
        this.displayItem.checkbox_list,
        LIST)
    };

    this.http.put(
      SysConf.UPDATE_ITEM + '?' +
      'key=' + this.aService.getToken(),
      Object.assign({}, { _id: this.displayItem._id }, CHECKBOX_LIST))
    .subscribe(obs => {
        // console.log(JSON.stringify(obs));
        if (obs['ok'] === 1) {
          this.store.dispatch(new ItemDetailRedux.NewCheckBoxItem(item));
        } else {
          this.store.dispatch(new ItemDetailRedux.CancelAct());
        }
    });
  }

  handleModifyItem = (item: ICheckbox) => {
    // console.log(`handleModifyItem() on!!`);
    const LIST = { list: [...this.displayItem.checkbox_list.list.map(value => {
        return value.id === item.id ? item : value;
      })] };

    const CHECKBOX_LIST = {
      checkbox_list: Object.assign({}, this.displayItem.checkbox_list, LIST)
    };

    const QUERY = Object.assign({}, { _id: this.displayItem._id }, CHECKBOX_LIST);

    this.http.put(
        SysConf.UPDATE_ITEM + '?' +
        'key=' + this.aService.getToken(),
        QUERY)
    .subscribe(obs => {
        // console.log(JSON.stringify(obs));
        if (obs['ok'] === 1) {
            this.store.dispatch(new ItemDetailRedux.ModifyCheckBoxItem(item));
        } else {
            this.store.dispatch(new ItemDetailRedux.CancelAct());
        }
    });
  }

  handleRemoveItem = (item: ICheckbox) => {
    const LIST =  {
      list: [...this.displayItem.checkbox_list.list
        .filter(value => {
          return value.id !== item.id;
        })]
    };

    const CHECKBOX_LIST = {
      checkbox_list: Object.assign(
        {},
        this.displayItem.checkbox_list,
        LIST)
    };

    const QUERY = Object.assign({}, { _id: this.displayItem._id }, CHECKBOX_LIST);

    this.http.put(
      SysConf.UPDATE_ITEM + '?' +
      'key=' + this.aService.getToken(),
      QUERY)
    .subscribe(obs => {
      // console.log(JSON.stringify(obs));
      if (obs['ok'] === 1) {
        this.store.dispatch(new ItemDetailRedux.RemoveCheckBoxItem(item));
      } else {
        this.store.dispatch(new ItemDetailRedux.CancelAct());
      }
    });
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
    this.store.dispatch(new ComponentUiReducer.ModifyComponentAct(
      this.ui.getClone(
        {
          isEditText: false,
          isEditTitle: false
        })));
    this.clickEvent($event);
  }

  // 자식 컴포넌트들에게 클릭이벤트 전달해요.
  private clickEvent(event) {
    this.orderChild.emit({ request: SysConf.CLICK_EVENT, object: event });
  }

  private clickedTitle(evnet) {
    event.stopPropagation();
    this.store.dispatch(new ComponentUiReducer.ModifyComponentAct(
      this.ui.getClone(
        {
          isEditText: false,
          isEditTitle: true
        })));
    setTimeout(() => this.title.nativeElement.focus(), 0);
    this.clickEvent(event);
  }

  private clickedText(event) {
    event.stopPropagation();
    this.store.dispatch(new ComponentUiReducer.ModifyComponentAct(
      this.ui.getClone(
        {
          isEditText: true,
          isEditTitle: false
        })));
    setTimeout(() => this.textArea.nativeElement.focus(), 0);
    this.clickEvent(event);
  }

  private clickedEditingTitle(event) {
    event.stopPropagation();
    this.store.dispatch(new ComponentUiReducer.ModifyComponentAct(
      this.ui.getClone({ isEditText: false })));
    this.clickEvent(event);
  }

  private clickedEditingText(event) {
    event.stopPropagation();
    this.store.dispatch(new ComponentUiReducer.ModifyComponentAct(
      this.ui.getClone({ isEditTitle: false })));
    this.clickEvent(event);
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
    // const myRenderer = new marked.Renderer();
    // myRenderer.blockquote = function (value): string {
    //   return '<blockquote style="margin: 10px !important;">' + value + '</blockquote>';
    // };

    // myRenderer.code = function (value, language): string {
    //   return `<pre style="white-space: pre;"><code class="language-${language}">${value}</code></pre>`;
    //   // return `<pre style="white-space: pre;" class="language-${language}">${value}</pre>`;
    // };
    // console.log(marked(text, { renderer: myRenderer }));
    // return marked(text, { renderer: myRenderer });
    return marked(text);
  }

  change() {
    this.target.nativeElement.innerHTML = this.displayItem.text ?
      this.parseMarkdownToHtml(this.displayItem.text) : 'Click here To insert new text.';
    prism.highlightAllUnder(this.target.nativeElement);
  }

  ngOnDestroy() {
    this.store.dispatch(new ComponentUiReducer.RemoveComponentAct(this.ui.value));
    this.store.dispatch(new ItemDetailRedux.RemoveAct());
    this.store.dispatch(new FastRedux.RemoveAct(this.fastList));
    if (this.uiSubscriptions !== undefined) {
      this.uiSubscriptions.unsubscribe();
    }
    if (this.subscription !== undefined) {
      this.subscription.unsubscribe();
    }
    if (this.fastSubscription !== undefined) {
      this.fastSubscription.unsubscribe();
    }
  }
}
