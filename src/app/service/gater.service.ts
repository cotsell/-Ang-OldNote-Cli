import { Injectable, EventEmitter } from '@angular/core';


// 이 서비스는 Give And Take하는 용도의 중개자 서비스에요.
// 한번에 여러개의 구독자가 생기는 경우에는 어떻게 할 지 고민을 해봐야 겠어요.
// 배열을 막 이렇게 끼얹나?
@Injectable()
export class GaterService {
  giveEvent: EventEmitter<any> = new EventEmitter();
  takeEvent: EventEmitter<any> = new EventEmitter();

  constructor() {
  }

}
