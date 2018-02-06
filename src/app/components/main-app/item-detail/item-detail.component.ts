import { Component, OnInit, OnDestroy, EventEmitter } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormControl } from '@angular/forms';
import * as marked from 'marked';

import { GaterService } from '../../../service/gater.service';
import { SysConf } from '../../../service/sysConfig';
import { AccountService } from '../../../service/account.service';
import { NetworkService } from '../../../service/network.service';
import { IItem } from '../../../service/Interface';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit, OnDestroy {
  itemId;
  item: IItem;
  tags: string[] = [];
  fastList: IItem[];
  orderChild: EventEmitter<any> = new EventEmitter();

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
  isEditText = false;
  isEditTitle = false;

  constructor(private router: ActivatedRoute,
              private http: HttpClient,
              private aService: AccountService,
              private network: NetworkService) {
    this.itemId = router.snapshot.params['id'];
    this.settingMakred();
  }

  ngOnInit() {
    // this.getItem();
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
  saveText($event) {
    this.item.text = this.textForm.value['textarea'];
    this.isEditText = false;
    // console.log(`EVENT!! : ` + this.textForm.value);
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

  // <input>엘리먼트에 포커스를 줍니다.
  focusOnElement($event) {
    $event.focus();
  }

  focusOutManage($event) {
    // console.log($event);

    this.clickEvent($event);

    const tagName = $event['target']['tagName'];
    const name = $event['target']['name'];

    if (tagName === 'DIV' || tagName === 'FORM') {
      this.isEditText = false;
      this.isEditTitle = false;
    } else if (tagName === 'A' && name === 'title') {
      this.isEditText = false;
    } else if (tagName === 'A' && name === 'text') {
      this.isEditTitle = false;
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
    this.network.getFast(
      {
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

  clickEvent(event) {
    // console.log(`ttttt`);
    this.orderChild.emit({ request: SysConf.CLICK_EVENT, object: event });
  }

  receiveOutput(event) {
    console.log(`item-detail.component.ts: receiveOutput(): `, event);
    switch (event.request) {
      case SysConf.GET_FAST_LIST_FROM_SERVER :
        console.log(`item-detail.component.ts: receiveOutput(): getFast()`, event.request);
        this.getFast();
        break;
    }
  }

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
    console.log(marked(text, { renderer: myRenderer }));
    return marked(text, { renderer: myRenderer });
  }

  ngOnDestroy() {
  }
}
