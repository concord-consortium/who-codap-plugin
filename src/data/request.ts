import { ICaseValue } from "../types";
import { attributes, countries, regions, years } from "./selectors";
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

const attributeMap = makeMap(attributes);
const regionMap = makeMap(regions);
const countryMap = makeMap(countries);
const yearMap = makeMap(years);

export const requestData = async (options: IRequestDataOptions): Promise<ICaseValue[]> => {
  return new Promise<ICaseValue[]>((resolve, reject) => {
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

    const cases = filteredRows
      .reduce<Record<string, ICaseValue>>((acc, [attributeId, countryId, yearId, value]) => {
        const attribute = attributeMap[attributeId];
        const country = countryMap[countryId];
        const region = regionMap[country.regionId];
        const year = yearMap[yearId];

        // Create the key for grouping by year and country
        const yearCountryKey = `${year.name}-${country.name}`;
        // Initialize the group if it doesn't exist yet
        if (!acc[yearCountryKey]) {
          acc[yearCountryKey] = {
            Year: year.name,
            Country: country.name,
            Region: region.name
          };
        }

        // Add the attribute and its value
        acc[yearCountryKey][attribute.name] = value;

        return acc;
      }, {});

    resolve(Object.values(cases));
  });
};
