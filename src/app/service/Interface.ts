// Client에서만 쓰는 인터페이스
export interface IOutputMsg {
    request: string;
}

export interface IOrderMsg {
    request: string;
    object?: any;
}

// Server와 동기화시켜야 하는 인터페이스
export interface IProject {
    _id?: string;
    title?: string;
    writer_id?: string;
    num?: number;
 }

export interface ISubject {
    _id?: string;
    writer_id?: string;
    project_id?: string;
    number?: number;
    title?: string;
}

export interface IItem {
    _id?: string;
    writer_id?: string;
    project_id?: string;
    subject_id?: string;
    number?: number;
    title?: string;
    text?: string;
    tags?: string[];
}

export interface ITag {
    _id?: string;
    title?: string;
    writer_id?: string;
    number?: number;
}

export interface IUser {
    _id?: string;
    id?: string;
    display_name?: string;
    account_div?: number;
}

export class DumyClass {

}
