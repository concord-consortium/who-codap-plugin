import { ICaseValue, IRawDataValueRow } from "../types";
import { attributes, countries, regions, years } from "./selectors";

// this is a large file and webpack.config.js is setup to embed this as an asset filename
// so that we can use fetch() with it below
import values from "./values.json";
const valuesJSONSrcUrl = values as unknown as string;

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

let rawDataValueRows: IRawDataValueRow[] | undefined = undefined;

const loadJSON = async (): Promise<IRawDataValueRow[]> => {
  if (rawDataValueRows) {
    return rawDataValueRows;
  }

  const response = await fetch(valuesJSONSrcUrl);
  if (!response.ok) {
    throw new Error(`Failed to fetch values.json: ${response.statusText}`);
  }

  const data: IRawDataValueRow[] = await response.json();
  return data;
};

export const requestData = async (options: IRequestDataOptions): Promise<ICaseValue[]> => {
  const fetchedRows = await loadJSON();

  const { attributeIds, countryIds, allCountries, allCountriesInRegionIds, yearIds, allYears } = options;

  // match the fetched rows to the filter options
  const filteredRows = fetchedRows
    .filter(([attributeId, countryId, yearId, value]) => {
      let match = attributeIds.length === 0 || attributeIds.includes(attributeId);
      match = match && (allCountries || countryIds.length === 0 || countryIds.includes(countryId) || allCountriesInRegionIds.includes(countryMap[countryId].regionId));
      match = match && (allYears || yearIds.length === 0 || yearIds.includes(yearId));
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

  return Object.values(cases);
};
