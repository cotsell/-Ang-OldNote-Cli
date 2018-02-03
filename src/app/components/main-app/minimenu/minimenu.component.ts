import { Component, OnInit, Input, Output, EventEmitter, ViewChild } from '@angular/core';

import { NetworkService } from '../../../service/network.service';
import { SysConf } from '../../../service/sysConfig';
import { IOutputMsg, IOrderMsg } from '../../../service/Interface';
import { ElementRef } from '@angular/core';

export interface What {
  request: string;
  object: any;
}

@Component({
  selector: 'app-minimenu',
  templateUrl: './minimenu.component.html',
  styleUrls: ['./minimenu.component.css']
})
export class MinimenuComponent implements OnInit {
@Input() object: What;
@Input() order: EventEmitter<IOrderMsg>;
@Output() output: EventEmitter<any> = new EventEmitter();

@ViewChild('menu_layer') menuLayer: ElementRef;
@ViewChild('menu_button') menuButton: ElementRef;

  constructor(private network: NetworkService) {
  }

  ngOnInit() {
    // 부모로부터 받을 명령을 구독합니다.
    this.order.subscribe(obs => {
      // console.log(obs);
      switch (obs.request) {

        case SysConf.CLICK_EVENT :
          if (obs.object.target.id !== 'minimenu_main_div' &&
              obs.object.target.id !== 'hide_menu') {
            // console.log(obs.object);
            this.closeMenuLayer();
          }
          break;

        case SysConf.SHOW_MINI_MENU_BUTTON :
          this.menuButton.nativeElement.hidden = false;
          break;

        case SysConf.HIDE_MINI_MENU_BUTTON :
          this.menuButton.nativeElement.hidden = true;
          break;
      }
    });
  }

  controlLayer(event, target) {
    event.stopPropagation(); // 이벤트 버블링을 방지해줘요.
    target.hidden = !target.hidden;
    // console.log(target.hidden);
  }

  closeLayer(target) {
    target.hidden = true;
  }

  // 낭비인건 알지만, @ViewChild()를 써보기 위해서 따로 만들어봤어요.
  closeMenuLayer() {
    // console.log(`minimenu.components.ts: closeMenuLayer(): 레이어를 닫을래요.`);
    this.menuLayer.nativeElement.hidden = true;
  }

  Output(msg: IOutputMsg) {
    this.closeMenuLayer();
    console.log(`minimenu.component.ts: Output(): `, msg);
    this.output.emit(msg);
  }

}
