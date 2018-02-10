import * as Interface from '../Interface';

export interface StoreInfo {
  projectList: Interface.IProject[];
  subjectList: Interface.ISubject[];
  itemList: Interface.IItem[];
  fastList: Interface.IItem[];
  itemDetail: Interface.IItem;

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
