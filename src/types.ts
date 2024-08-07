export interface IAttributeGroup {
  id: number;
  name: string;
}

export interface IAttributeUnit {
  id: number;
  name: string;
}

export interface IAttribute {
  id: number;
  attributeGroupId: number;
  name: string;
  unitId: number;
}

export interface IRegion {
  id: number;
  name: string;
}

export interface ICountry {
  id: number;
  name: string;
  regionId: number;
}

export interface IYear {
  id: number;
  name: string;
}

export interface IDataValue {
  attributeId: number;
  countryId: number;
  yearId: number;
  value: number;
}

                            // attributeId, countryId, yearId, value
export type IDataValueRow = [number, number, number, number];

