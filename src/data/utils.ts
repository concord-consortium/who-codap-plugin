interface IAttrLike {
  id: number;
}

export const isAttrSelected = (selectedAttributes: IAttrLike[], attribute: IAttrLike) => {
  return selectedAttributes?.some(attr => attr.id === attribute.id);
};

export const selectedAttrCount = (selectedAttributes: IAttrLike[], attributesGroup: IAttrLike[]) => {
  return selectedAttributes.filter(attr => attributesGroup.some(groupAttr => groupAttr.id === attr.id)).length;
};
