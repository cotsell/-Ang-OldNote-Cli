import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css']
})
export class TagComponent implements OnInit {
  @Input() tagList: string[];
  @Output() outTagList: EventEmitter<string[]> = new EventEmitter();

  constructor() {
    this.tagList = [];
  }

  insertTag($event) {
    if ($event['key'] === 'Enter') {
      const value = $event.target.value;
      if (this.tagList === undefined || this.tagList === null) {
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
