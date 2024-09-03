import { IAttribute } from "../types";

export const isAttrSelected = (selectedAttributes: IAttribute[], attribute: IAttribute) => {
  return selectedAttributes?.some(attr => attr.id === attribute.id);
};

export const selectedAttrCount = (selectedAttributes: IAttribute[], attributesGroup: IAttribute[]) => {
  return selectedAttributes.filter(attr => attributesGroup.some(groupAttr => groupAttr.id === attr.id)).length;
};
