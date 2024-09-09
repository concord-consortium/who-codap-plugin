import { codapInterface, createChildCollection, createDataContext, createParentCollection, createTable, getAttributeList } from "@concord-consortium/codap-plugin-api";
import { IAttribute } from "../types";
import { makeMap } from "./utils";
import { attributeGroups, attributeUnits } from "./selectors";

export const kPluginName = "World Health Organization Plugin";
export const kVersion = "0.0.1";
export const kInitialDimensions = {
  width: 380,
  height: 520
};
export const kDataContextName = "WHODataPluginData";
export const kParentCollectionName = "Countries";
export const kChildCollectionName = "Attributes";

export const kParentCollectionAttributes = [
  {
    name: "Country",
    type: "categorical"
  },
  {
    name: "Code",
    type: "categorical",
    hidden: true
  },
  {
    name: "Boundary",
    formula: "lookupBoundary(country_boundaries, Code)"
  },
  {
    name: "Region",
    type: "categorical"
  }
];

export const deleteAllCases = async () => {
  const message = {
    action: "delete",
    resource : "dataContext[" + kDataContextName + "].allCases"
  };
  return codapInterface.sendRequest(message);
};

const kYearAttribute = {
  name: "Year",
  type: "numeric",
  description: "Year"
};
const units = makeMap(attributeUnits);
const attrGroup = makeMap(attributeGroups);

export const WHOAttributeToCODAPAttr = (attr: IAttribute) => ({
  name: attr.name,
  type: "numeric",
  unit: units[attr.unitId].name,
  description: `Attribute group: ${attrGroup[attr.attributeGroupId].name}`
});

export const getChildCollectionAttributes = (attributes: IAttribute[]) => {
  return [
    kYearAttribute,
    ...attributes.map(attr => WHOAttributeToCODAPAttr(attr))
  ];
};

export const createNewDataContext = async (attributes: IAttribute[]) => {
  const childCollectionAttributes = getChildCollectionAttributes(attributes);

  await createDataContext(kDataContextName);
  await createParentCollection(
    kDataContextName,
    kParentCollectionName,
    kParentCollectionAttributes
  );
  await createChildCollection(
    kDataContextName,
    kChildCollectionName,
    kParentCollectionName,
    childCollectionAttributes
  );
  await createTable(kDataContextName);
};

export const syncChildCollectionAttributes = async (attributes: IAttribute[]) => {
  const childCollectionAttributes = getChildCollectionAttributes(attributes);

  const attrList = await getAttributeList(kDataContextName, kChildCollectionName);
  if (attrList.success) {
    const existingAttributes = attrList.values;
    const attributesToCreate = childCollectionAttributes.filter(a => !existingAttributes.find((ea: any) => ea.name === a.name));
    attributesToCreate.forEach(attr => {
      codapInterface.sendRequest({
        action: "create",
        resource: `dataContext[${kDataContextName}].collection[${kChildCollectionName}].attribute`,
        values: attr
      });
    });
    const attributesToRemove = existingAttributes.filter((ea: any) => !childCollectionAttributes.find(a => a.name === ea.name));
    attributesToRemove.forEach((a: any) => {
      codapInterface.sendRequest({
        action: "delete",
        resource: `dataContext[${kDataContextName}].collection[${kChildCollectionName}].attribute[${a.name}]`
      });
    });
  }
};
