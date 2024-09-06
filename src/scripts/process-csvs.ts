/* eslint-disable no-console, @typescript-eslint/no-unused-vars, no-prototype-builtins, @typescript-eslint/no-non-null-assertion */

import { attributes, countries, years } from "../data/selectors";
import { IRawDataValueRow } from "../types";
import * as fs from "fs";
import * as path from "path";
import csv from "csv-parser";
import { countryCodes } from "./country-codes";

type Filter = Record<string, string|undefined>;
type CSVAttr = {attrId?: number, filter?: Filter};
type CSVAttrs = Record<string, CSVAttr>;
type CSVOptions = {valueCol?: string, countryCol?: string, yearCol?: string, attrs: CSVAttrs};
type CSVMap = Record<string, CSVOptions>;
type SelectorIdMap = Record<string, number|undefined>;
type NormalizedMap = Record<string, string>;

const countryIdMap  = countries.reduce<SelectorIdMap>((acc, cur) => {
  acc[cur.name] = cur.id;
  return acc;
}, {});
const yearIdMap  = years.reduce<SelectorIdMap>((acc, cur) => {
  acc[cur.name] = cur.id;
  return acc;
}, {});

const normalizedCountryMap: NormalizedMap = {
  "Puerto Rico": "United States of America",
  "Netherlands": "Netherlands (Kingdom of the)",
  "Turkey": "Türkiye",
  "T?rkiye": "Türkiye", // csv was exported without uft-8 encoding...
  "Iran": "Iran (Islamic Republic of)",
  "Vietnam": "Viet Nam",
  "Venezuela": "Venezuela (Bolivarian Republic of)",
  "Syria": "Syrian Arab Republic",
  "Russia": "Russian Federation",
  "Congo (Democratic Republic)": "Democratic Republic of the Congo",
  "Bolivia": "Bolivia (Plurinational State of)",
  "United States": "United States of America",
  "Tanzania": "United Republic of Tanzania",
  "United Kingdom": "United Kingdom of Great Britain and Northern Ireland",
  "Korea (North)": "Democratic People's Republic of Korea",
  "Korea (South)": "Republic of Korea",
  "Micronesia": "Micronesia (Federated States of)",
  "Moldova": "Republic of Moldova",
  "Czech Republic": "Czechia",
  "Cape Verde": "Cabo Verde",
};

const inputCSV = (name: string, options?: {valueCol?: string, countryCol?: string}): CSVOptions => {
  const {valueCol, countryCol} = options ?? {};
  return {
    valueCol: valueCol ?? "Death rate per 100 000 population",
    countryCol: countryCol ?? "Country Name",
    attrs: {
      [`${name} Deaths`]: {filter: {"Sex": "All"}},
      [`${name} Deaths, Female`]: {filter: {"Sex": "Female"}},
      [`${name} Deaths, Male`]: {filter: {"Sex": "Male"}},
    }
  };
};

const allRowsOutputCSV = (name: string): CSVOptions => {
  return outputCSV({
    [name]: {filter: {}},
  });
};

const maleFemaleOutputCSV = (name: string, options?: {Dim2?: string}): CSVOptions => {
  const {Dim2} =  options ?? {};

  return outputCSV({
    [`${name}`]: {filter: {Dim1: "SEX_BTSX", Dim2}},
    [`${name}, Female`]: {filter: {Dim1: "SEX_FMLE", Dim2}},
    [`${name}, Male`]: {filter: {Dim1: "SEX_MLE", Dim2}},
  });
};

const outputCSV = (attrs: CSVAttrs): CSVOptions => {
  for (const [key, attr] of Object.entries(attrs)) {
    attr.filter = attr.filter ?? {};
    attr.filter.SpatialDimType = "COUNTRY";
  }

  return {
    countryCol: "SpatialDim",
    yearCol: "TimeDim",
    attrs
  };
};

const csvMap: CSVMap = {
  "input/Asthma Death Rates.csv": inputCSV("Asthma"),
  "input/Cancer Death Rate.csv": inputCSV("Cancer"),
  "input/Cardiovascular Disease Death Rate.csv": inputCSV("Cardiovascular Disease"),
  "input/Diabetes Death Rate.csv": inputCSV("Diabetes", {valueCol: "Value (Percentage)", countryCol: "Country"}),
  "input/Tuberculosis Death Rates.csv": inputCSV("Tuberculosis"),
  "output/AIR_5.csv": maleFemaleOutputCSV("Air Pollution Deaths"),
  "output/MCV2.csv": allRowsOutputCSV("Measles (including MMR) Vaccination"),
  "output/WHS3_49.csv": allRowsOutputCSV("Polio Cases"),
  "output/WHS3_53.csv": allRowsOutputCSV("Mumps Cases"),
  "output/WHS3_62.csv": allRowsOutputCSV("Measles Cases"),
  "output/WHS4_543.csv": allRowsOutputCSV("Tuberculosis (BCG) Vaccination"),
  "output/WHS4_544.csv": allRowsOutputCSV("Polio Vaccination"),
  "output/NCD_BMI_30A.csv": maleFemaleOutputCSV("Obesity, Adults (18+ yr)", {Dim2: "AGEGROUP_YEARS18-PLUS"}),
  "output/NCD_GLUC_03.csv": maleFemaleOutputCSV("Diabetes, Adults (18+)", {Dim2: "AGEGROUP_YEARS18-PLUS"}),
  "output/NCD_HYP_PREVALENCE_C.csv": maleFemaleOutputCSV("Hypertension, Adults (30+)"),
  "output/SDGPM25.csv": outputCSV({
    "Air Pollution, PM2.5": {filter: {Dim1: "RESIDENCEAREATYPE_TOTL"}},
    "Air Pollution, PM2.5, City": {filter: {Dim1: "RESIDENCEAREATYPE_CITY"}},
    "Air Pollution, PM2.5, Town": {filter: {Dim1: "RESIDENCEAREATYPE_TOWN"}},
    "Air Pollution, PM2.5, Rural": {filter: {Dim1: "RESIDENCEAREATYPE_RUR"}},
  }),
  "output/WSH_10.csv": outputCSV({
    "Diarrhea Deaths": {filter: {Dim1: "SEX_BTSX"}},
    "Diarrhea Deaths, Female": {filter: {Dim1: "SEX_FMLE"}},
    "Diarrhea Deaths, Male": {filter: {Dim1: "SEX_MLE"}},
    "Diarrhea Deaths, Children (0-4 yr)": {filter: {Dim1: "SEX_BTSX", Dim2: "AGEGROUP_YEARSUNDER5"}},
  }),
  "output/WSH_WATER_SAFELY_MANAGED.csv": outputCSV({
    "Drinking Water (Safely Managed)": {filter: {Dim1: "RESIDENCEAREATYPE_TOTL"}},
    "Drinking Water (Safely Managed), Urban": {filter: {Dim1: "RESIDENCEAREATYPE_URB"}},
    "Drinking Water (Safely Managed), Rural": {filter: {Dim1: "RESIDENCEAREATYPE_RUR"}},
  }),
  "output/NCD_BMI_PLUS2C.csv": outputCSV({
    "Obesity, Children (5-9 yr)": {filter: {Dim1: "SEX_BTSX", Dim2: "AGEGROUP_YEARS05-09"}},
    "Obesity, Children (5-9 yr), Female": {filter: {Dim1: "SEX_FMLE", Dim2: "AGEGROUP_YEARS05-09"}},
    "Obesity, Children (5-9 yr), Male": {filter: {Dim1: "SEX_MLE", Dim2: "AGEGROUP_YEARS05-09"}},
    "Obesity, Adolescents (10-19 yr)": {filter: {Dim1: "SEX_BTSX", Dim2: "AGEGROUP_YEARS10-19"}},
    "Obesity, Adolescents (10-19 yr), Female": {filter: {Dim1: "SEX_FMLE", Dim2: "AGEGROUP_YEARS10-19"}},
    "Obesity, Adolescents (10-19 yr), Male": {filter: {Dim1: "SEX_MLE", Dim2: "AGEGROUP_YEARS10-19"}},
  })
 };

// first match up attributes with csvs
for (const [csvKey, csvOptions] of Object.entries(csvMap)) {
  for (const [attrKey, csvAttr] of Object.entries(csvOptions.attrs)) {
    const matchingAttribute = attributes.find(attr => attr.name === attrKey);

    if (matchingAttribute) {
      csvAttr.attrId = matchingAttribute.id;
    } else {
      throw new Error(`Attribute with key "${attrKey}" not found in attributes`);
    }
  }
}

// then process the csvs ...

const normalize = (value: string, map: NormalizedMap) => {
  return map[value] ?? value;
};

const lookupInSelectorIdMap = (name: string, map: SelectorIdMap, filename: string, mapName: string) => {
  if (map.hasOwnProperty(name)) {
    return map[name]!;
  }
  throw new Error(`Unable to find ${name} in ${mapName} for ${filename}`);
};

const validateRowCols = (row: Record<string, any>, cols: string[], filename: string) => {
  cols.forEach(col => {
    if (!row.hasOwnProperty(col)) {
      throw new Error(`row does not have ${col} column in ${filename}`);
    }
  });
};

const ensureNumber = (value: string|number) => {
  if (typeof value === "string") {
    if (value.includes(".")) {
      return parseFloat(value);
    }
    return parseInt(value, 10);
  }
  return value;
};

const errors: Record<string, boolean> = {};
const rawDataValueRows: IRawDataValueRow[] = [];

const parseCSVFiles = async () => {
  const promises: Promise<void>[] = [];

  for (const [filename, csvOptions] of Object.entries(csvMap)) {
    const filePath = path.resolve(__dirname, filename);

    const parsePromise = parseCSVFile(filename, filePath, csvOptions);
    promises.push(parsePromise);
  }

  await Promise.all(promises);

  rawDataValueRows.sort((a, b) => {
    let result = a[0] - b[0];
    if (result === 0) {
      result = a[1] - b[1];
      if (result === 0) {
        result = a[2] - b[2];
      }
    }
    return result;
  });

  console.log("All CSV files have been processed. Found", rawDataValueRows.length, "rows. Creating data file.");

  const outputFilePath = path.resolve(__dirname, "../data/values.json");
  fs.writeFileSync(outputFilePath, JSON.stringify(rawDataValueRows));
};

const parseCSVFile = async (filename: string, filePath: string, csvOptions: CSVOptions) => {
  return new Promise<void>((resolve, reject) => {
    const countryCol = csvOptions.countryCol || "Country";
    const yearCol = csvOptions.yearCol || "Year";
    const valueCol = csvOptions.valueCol || "NumericValue";

    fs.createReadStream(filePath, { encoding: "utf8" })
      .pipe(csv())
      .on("data", (row) => {
        validateRowCols(row, [countryCol, yearCol, valueCol], filename);

        const value = ensureNumber(row[valueCol]);
        if (value !== null) {
          for (const [attrKey, csvAttr] of Object.entries(csvOptions.attrs)) {
            let match = true;

            if (csvAttr.filter) {
              for (const [filterKey, filterValue] of Object.entries(csvAttr.filter)) {
                match = match && (filterValue === undefined || (row.hasOwnProperty(filterKey) && row[filterKey] === filterValue));
              }
            }

            if (match) {
              try {
                const rawCountry = countryCodes[row[countryCol]] ?? row[countryCol];
                const country = normalize(rawCountry, normalizedCountryMap);
                const year = `${row[yearCol] ?? ""}`;
                const attrId = csvAttr.attrId!;
                const countryId = lookupInSelectorIdMap(country, countryIdMap, filename, "countryIdMap");
                const yearId = lookupInSelectorIdMap(year, yearIdMap, filename, "yearIdMap");
                rawDataValueRows.push([attrId, countryId, yearId, value]);
              } catch (err: any) {
                if (!errors[err.message]) {
                  console.log(err.message);
                  errors[err.message] = true;
                }
              }
            }
          }
      }
      })
      .on("end", () => {
        resolve();
      })
      .on("error", (err) => {
        console.error(`Error processing file ${filename}:`, err);
        reject(err);
      });
  });
};

parseCSVFiles().catch((err) => console.error("Error in parsing CSV files:", err));

/* eslint-enable no-console, @typescript-eslint/no-unused-vars, no-prototype-builtins, @typescript-eslint/no-non-null-assertion */
