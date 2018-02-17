import * as Interface from '../Interface';
import Reducers from './reducers';

export interface StoreInfo {
  projectList: Interface.IProject[];
  subjectList: Interface.ISubject[];
  itemList: Interface.IItem[];
  fastList: Interface.IItem[];
  itemDetail: Interface.IItem;
  componentUi: Interface.ComponentUi[];
}

export function getReducers() {
  return { projectList: Reducers.project.Reducer,
            subjectList: Reducers.subject.Reducer,
            itemList: Reducers.itemList.Reducer,
            itemDetail: Reducers.itemDetail.Reducer,
            fastList: Reducers.fast.Reducer,
            componentUi: Reducers.componentUi.Reducer };
}

export function getProjectList(state: StoreInfo): Interface.IProject[] {
  return state.projectList;
}

export function getSubjectList(state: StoreInfo): Interface.ISubject[] {
  return state.subjectList;
}

export function getItemList(state: StoreInfo): Interface.IItem[] {
  return state.itemList;
}

export function getFastList(state: StoreInfo): Interface.IItem[] {
  return state.fastList;
}

export function getItemDetail(state: StoreInfo): Interface.IItem {
  return state.itemDetail;
}

export function getComponentUi(state: StoreInfo): Interface.ComponentUi[] {
  return state.componentUi;
}
