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
  code: string;
  regionId: number;
}

export interface IYear {
  id: number;
  name: string;
}

export interface ICaseValue {
  Country: string;
  Region: string;
  Year: string;
  [string: string]: number | string; // attribute name and value
}

                            // attributeId, countryId, yearId, value
export type IRawDataValueRow = [number, number, number, number];

