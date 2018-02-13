import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { SysConf } from '../service/sysConfig';
import { AccountService } from '../service/account.service';
import { Observable } from 'rxjs/Observable';
import { ITag, IProject, ISubject, IItem } from './Interface';

@Injectable()
export class NetworkService {

  constructor(private http: HttpClient,
              private aService: AccountService) { }

  getSubjectList(projectId: string): Observable<ISubject[]> {
    return this.http.get<ISubject[]>(SysConf.GET_SUBJECT_LIST + '?' +
                                    'key=' + this.aService.getToken() + '&' +
                                    'id=' + projectId);
  }


  getItem(itemId: string): Observable<any> {
    return this.http.get(SysConf.GET_ITEM + '?' +
                        'key=' + this.aService.getToken() + '&' +
                        'item_id=' + itemId
                        );
  }

  getItemListWithSubjects(subjects: ISubject[]): Observable<IItem[]> {
    const ids = subjects.map(value => {
      return value._id;
    });

    return this.http.get<IItem[]>(SysConf.GET_ITEM_LIST + '?' +
                                  'key=' + this.aService.getToken() + '&' +
                                  'ids=' + ids);
  }

  getTags(object: ITag): Observable<any> {
    return this.http.get(SysConf.GET_TAGS + '?' +
                          'key=' + this.aService.getToken() + '&' +
                          'writer_id=' + object.writer_id
                          );
  }

  getFast(json: IItem): Observable<any> {
    return this.http.get(SysConf.GET_FAST + '?' +
                          'key=' + this.aService.getToken() + '&' +
                          'project_id=' + json.project_id + '&' +
                          'tags=' + json.tags
                          );
  }

  deleteProject(project: IProject): Observable<any> {
    return this.http.delete(SysConf.DELETE_PROJECT + '?' +
                          'key=' + this.aService.getToken() + '&' +
                          '_id=' + project._id
                          );
  }

  deleteSubject(subject: ISubject): Observable<any> {
    return this.http.delete(SysConf.DELETE_SUBJECT + '?' +
                            'key=' + this.aService.getToken() + '&' +
                            '_id=' + subject._id
                            );
  }

  deleteItem(item: IItem): Observable<any> {
    return this.http.delete(SysConf.DELETE_ITEM + '?' +
                            'key=' + this.aService.getToken() + '&' +
                            '_id=' + item._id
                            );
  }

  deleteFast(fast: IItem): Observable<any> {
    return this.http.delete(SysConf.DELETE_FAST + '?' +
                            'key=' + this.aService.getToken() + '&' +
                            '_id=' + fast._id
                            );
  }

  insertFast(fast: IItem): Observable<any> {
    return this.http.post(SysConf.INSERT_FAST + '?' +
                          'key=' + this.aService.getToken(),
                          fast);
  }
}
