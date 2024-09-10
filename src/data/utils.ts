import { IAttribute, ICaseValue } from "../types";

interface IAttrLike {
  id: number;
}

export const isAttrSelected = (selectedAttributes: IAttrLike[], attribute: IAttrLike) => {
  return selectedAttributes?.some(attr => attr.id === attribute.id);
};

export const selectedAttrCount = (selectedAttributes: IAttrLike[], attributesGroup: IAttrLike[]) => {
  return selectedAttributes.filter(attr => attributesGroup.some(groupAttr => groupAttr.id === attr.id)).length;
};

export const makeMap = <T>(list: (T & {id: number})[]): Record<number, T> => {
  return list.reduce<Record<number, T>>((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
};

export const isDataComplete = (cases: ICaseValue[], selectedAttributes: IAttribute[]) => {
  return cases.every(c => selectedAttributes.every(a => c[a.name] !== undefined));
};
