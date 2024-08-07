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
  attribute: string;
  attributeGroup: string;
  units: string;
  country: string;
  region: string;
  year: string;
  value: number;
}

                            // attributeId, countryId, yearId, value
export type IRawDataValueRow = [number, number, number, number];

