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

const allCountryIds = countries.map(c => c.id);
const allYearIds = years.map(y => y.id);

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

  const _countryIds = countryIds.length > 0 ? countryIds : allCountryIds;
  const _yearIds = yearIds.length > 0 ? yearIds : allYearIds;

  const countryYearMap: Record<string, ICaseValue> = {};
  _countryIds.forEach(countryId => {
    _yearIds.forEach(yearId => {
      const country = countryMap[countryId];
      const region = regionMap[country.regionId];
      const year = yearMap[yearId];

      countryYearMap[`${countryId}-${yearId}`] = {
        Country: country.name,
        Region: region.name,
        Year: year.name,
      };
    });
  });

  filteredRows.reduce<Record<string, ICaseValue>>((acc, [attributeId, countryId, yearId, value]) => {
    // Create the key for grouping by year and country
    const countryYearKey = `${countryId}-${yearId}`;
    // Add the attribute and its value
    if (acc[countryYearKey]) {
      acc[countryYearKey][attributeMap[attributeId].name] = value;
    } else {
      console.warn("Incorrect country-year map");
    }
    return acc;
  }, countryYearMap);

  return Object.values(countryYearMap);
};
