import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Http } from '@angular/http';
import { AccountService } from '../../../service/account.service';
import { SysConf } from '../../../service/sysConfig';

// interface Subjects {

// }

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.css']
})
export class SubjectListComponent implements OnInit {
  projectId: string;
  subjectList;

  constructor(private aService: AccountService,
              private route: ActivatedRoute,
              private http: Http) {
    this.projectId = route.snapshot.params['id'];
  }

  ngOnInit() {
    this.getSubjectList();
  }

  private getSubjectList() {
    this.http.get(SysConf.GET_SUBJECT_LIST + '?' +
                  'key=' + this.aService.getToken() + '&' +
                  'id=' + this.projectId)
    .map(r => r.json())
    .subscribe( obs => {
      // this.subjectList = obs;
      // console.log(JSON.stringify(this.subjectList));
      this.subjectList = this.organize(obs);
    });

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
