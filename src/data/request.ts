import { IDataValue } from "../types";
import { attributeGroups, attributes, attributeUnits, countries, regions, years } from "./selectors";
import { rawDataValueRows } from "./values";

interface IRequestDataOptions {
  attributeIds: number[],
  countryIds: number[],
  allCountries: boolean,
  allCountriesInRegionIds: number[],
  yearIds: number[],
  allYears: boolean,
}

const makeMap = <T>(list: (T & {id: number})[]): Record<number, T> => {
  return list.reduce<Record<number, T>>((acc, cur) => {
    acc[cur.id] = cur;
    return acc;
  }, {});
};

const attributeGroupMap = makeMap(attributeGroups);
const attributeUnitsMap = makeMap(attributeUnits);
const attributeMap = makeMap(attributes);
const regionMap = makeMap(regions);
const countryMap = makeMap(countries);
const yearMap = makeMap(years);

export const requestData = async (options: IRequestDataOptions): Promise<IDataValue[]> => {
  return new Promise<IDataValue[]>((resolve, reject) => {
    const { attributeIds, countryIds, allCountries, allCountriesInRegionIds, yearIds, allYears } = options;

    // this will probably change to fetch a JSON file per attribute but for now we use the stubbed values
    const fetchedRows = rawDataValueRows;

    // match the fetched rows to the filter options
    const filteredRows = fetchedRows
      .filter(([attributeId, countryId, yearId, value]) => {
        let match = attributeIds.includes(attributeId);
        match = match && (allCountries || countryIds.includes(countryId) || allCountriesInRegionIds.includes(countryMap[countryId].regionId));
        match = match && (allYears || yearIds.includes(yearId));
        return match;
      });

    // convert from a raw row to an array that can be posted to CODAP
    const values = filteredRows
      .map<IDataValue>(([attributeId, countryId, yearId, value]) => {
        const attribute = attributeMap[attributeId];
        const attributeGroup = attributeGroupMap[attribute.attributeGroupId];
        const units = attributeUnitsMap[attribute.unitId];
        const country = countryMap[countryId];
        const region = regionMap[country.regionId];
        const year = yearMap[yearId];

        return {
          attribute: attribute.name,
          attributeGroup: attributeGroup.name,
          units: units.name,
          country: country.name,
          region: region.name,
          year: year.name,
          value
        };
      });

    resolve(values);
  });
};
