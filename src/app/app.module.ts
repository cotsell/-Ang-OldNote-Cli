import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';

import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ToolbarComponent } from './components/main-app/toolbar/toolbar.component';
import { MainAppComponent } from './components/main-app/main-app.component';
import { ProjectListComponent } from './components/main-app/project-list/project-list.component';
import { ProjectComponent } from './components/main-app/project/project.component';
import { SignComponent } from './components/login-page/sign/sign.component';
import { Error404Component } from './components/errors/Error404/Error404.component';
import { ItemComponent } from './components/main-app/item/item.component';
import { ItemDetailComponent } from './components/main-app/item-detail/item-detail.component';
import { SubjectListComponent } from './components/main-app/subject-list/subject-list.component';

import { AccountService } from './service/account.service';
import { GaterService } from './service/gater.service';
import { NetworkService } from './service/network.service';
import { SubjectComponent } from './components/main-app/subject/subject.component';
import { FastInputComponent } from './components/main-app/fast-input/fast-input.component';
import { TagComponent } from './components/main-app/tag/tag.component';
import { MinimenuComponent } from './components/main-app/minimenu/minimenu.component';
import { FastMinilistComponent } from './components/main-app/fast-minilist/fast-minilist.component';
import { FastMenuComponent } from './components/main-app/minimenu-components/fast-menu/fast-menu.component';
import { ProjectMenuComponent } from './components/main-app/minimenu-components/project-menu/project-menu.component';
import { SubjectMenuComponent } from './components/main-app/minimenu-components/subject-menu/subject-menu.component';
import { ItemMenuComponent } from './components/main-app/minimenu-components/item-menu/item-menu.component';

import Reducers from './service/redux/reducers';

const route: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'projects', component: MainAppComponent,
      children: [
        { path: '', component: ProjectListComponent },
        { path: 'project/:id', component: SubjectListComponent },
        { path: 'item/:id', component: ItemDetailComponent }
      ]
  },
  { path: '**', component: Error404Component } // 라우터에 설정된 경로 외 접근은 여기로 연결.
];

@NgModule({
  declarations: [
    AppComponent,
    Error404Component,
    FastInputComponent,
    FastMenuComponent,
    FastMinilistComponent,
    ItemComponent,
    ItemDetailComponent,
    LoginPageComponent,
    MainAppComponent,
    MinimenuComponent,
    ProjectComponent,
    ProjectListComponent,
    SignComponent,
    SubjectComponent,
    SubjectListComponent,
    TagComponent,
    ProjectMenuComponent,
    SubjectMenuComponent,
    ItemMenuComponent,
    ToolbarComponent
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(route),
    HttpModule,
    ReactiveFormsModule,
    HttpClientModule,
    StoreModule.forRoot({ projectList: Reducers.project.Reducer,
                          subjectList: Reducers.subject.Reducer,
                          itemList: Reducers.itemList.Reducer,
                          itemDetail: Reducers.itemDetail.Reducer,
                          fastList: Reducers.fast.Reducer }),
    StoreDevtoolsModule.instrument({ maxAge: 5 })
  ],
  providers: [ AccountService, GaterService, NetworkService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
