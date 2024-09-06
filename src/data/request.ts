import { ICaseValue, IRawDataValueRow } from "../types";
import { attributes, countries, regions, years } from "./selectors";
import { makeMap } from "./utils";

// this is a large file and webpack.config.js is setup to embed this as an asset filename
// so that we can use fetch() with it below
import values from "./values.json";
const valuesJSONSrcUrl = values as unknown as string;

interface IRequestDataOptions {
  attributeIds: number[],
  countryIds: number[],
  yearIds: number[]
}

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

  const { attributeIds, countryIds, yearIds } = options;

  // match the fetched rows to the filter options
  const filteredRows = fetchedRows
    .filter(([attributeId, countryId, yearId, value]) => {
      let match = attributeIds.length === 0 || attributeIds.includes(attributeId);
      match = match && (countryIds.length === 0 || countryIds.includes(countryId));
      match = match && (yearIds.length === 0 || yearIds.includes(yearId));
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
