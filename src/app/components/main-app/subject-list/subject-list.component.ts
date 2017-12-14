import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { AccountService } from '../../../service/account.service';
import { SysConf } from '../../../service/sysConfig';
import { GaterService } from '../../../service/gater.service';

// interface Subjects {

// }

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
  // providers: [GaterService]
})
export class SubjectListComponent implements OnInit {
  projectId: string;
  subjectList;

  constructor(private aService: AccountService,
              private route: ActivatedRoute,
              private http: Http,
              private Gater: GaterService) {
    this.projectId = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getSubjectList();
    this.Gater.takeEvent.subscribe(this.divEvent);
  }

  private getSubjectList() {
    this.http.get(SysConf.GET_SUBJECT_LIST + '?' +
                  'key=' + this.aService.getToken() + '&' +
                  'id=' + this.projectId)
    .map(r => r.json())
    .subscribe( obs => {
      this.subjectList = this.organize(obs);
    });

  }

  divEvent = obs => {
    console.log(obs);
    if (obs['command'] === 'start') {
      for (let i = 0; i < this.subjectList.length; i++) {
        for (let j = 0; j < this.subjectList[i]['items'].length; j++) {
          if (this.subjectList[i]['items'][j]['_id'] === obs['item_id']) {
            this.Gater.giveEvent.emit(this.subjectList[i]['items'][j]);
            console.log(this.subjectList[i]['items'][j]);
          }
        }
      }
    }
  }

  organize(json) {
    const result: any[] = [];
    for (let i = 0; i < json['subjects'].length; i++) {
      result.push(json['subjects'][i]);
      result[i]['items'] = json['items'].filter((element) => {
        return element['subject_id'] === json['subjects'][i]['_id'];
      });
    }
    console.log(result);
    return result;
  }
}
