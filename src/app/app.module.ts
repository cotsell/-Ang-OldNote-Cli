import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpModule } from '@angular/http';
import { ReactiveFormsModule } from '@angular/forms';


import { AppComponent } from './app.component';
import { LoginPageComponent } from './components/login-page/login-page.component';
import { ToolbarComponent } from './components/main-app/toolbar/toolbar.component';
import { MainAppComponent } from './components/main-app/main-app.component';
import { ProjectListComponent } from './components/main-app/project-list/project-list.component';
import { ProjectComponent } from './components/main-app/project/project.component';
import { AccountService } from './service/account.service';
import { SignComponent } from './components/login-page/sign/sign.component';
import { Error404Component } from './components/errors/Error404/Error404.component';

const route: Routes = [
  { path: '', component: LoginPageComponent },
  { path: 'projects', component: MainAppComponent,
      children: [
        { path: '', component: ProjectListComponent },
        { path: 'project', component: ProjectComponent }
      ]
  },
  { path: '**', component: Error404Component } // 라우터에 설정된 경로 외 접근은 여기로 연결.
];

@NgModule({
  declarations: [
    AppComponent,
    ToolbarComponent,
    LoginPageComponent,
    MainAppComponent,
    ProjectListComponent,
    ProjectComponent,
    SignComponent,
    Error404Component
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(route),
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [ AccountService ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
