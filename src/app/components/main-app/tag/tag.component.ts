import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  @Input() tagList: string[]; // 부모 컴포넌트가 가지고 있는 tag의 list를 받을꺼에요.
  @Output() outTagList: EventEmitter<string[]> = new EventEmitter();

  constructor() {
    this.tagList = [];
  }

  insertTag($event) {
    if ($event['key'] === 'Enter') {
      const value = $event.target.value;
      // 부모로부터 받은 tag list가 정상적이지 않거나, 내용물이 없다면..
      if (this.tagList === undefined || this.tagList === null || this.tagList.length === 0) {
        this.tagList = [];
        this.tagList.push(value);
        this.outputTagList();
      } else {
        if (this.tagList.indexOf(value) === -1) {
          const length = this.tagList.push(value);
          if (length !== -1) {
            this.outputTagList();
          }
        }
      }
      $event.target.value = '';
    }
  }

  outputTagList() {
    this.outTagList.emit(this.tagList);
  }

  ngOnInit() {
  }

}
