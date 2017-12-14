import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SubjectListComponent } from '../subject-list/subject-list.component';
import { GaterService } from '../../../service/gater.service';

@Component({
  selector: 'app-item-detail',
  templateUrl: './item-detail.component.html',
  styleUrls: ['./item-detail.component.css']
})
export class ItemDetailComponent implements OnInit {
  itemId;
  item;
  isEditText = false;
  isEditTitle = false;

  constructor(private router: ActivatedRoute,
              private Gater: GaterService) {
    this.itemId = router.snapshot.params['id'];
  }

  ngOnInit() {
    this.Gater.giveEvent.subscribe(this.testGet);
    this.Gater.takeEvent.emit(
      { command: 'start',
        item_id: this.itemId
      });
  }

  testGet = obs => {
    console.log(JSON.stringify(obs));
    this.item = obs;
  }

  filterItem = (value) => {
    // return value
  }

  saveText($event) {
    this.isEditText = false;
    // To save something in textarea.
  }

}
