const axios = require('axios');
const fs = require('fs');
const { Parser } = require('json2csv');

const apiBaseUrl = 'https://ghoapi.azureedge.net/api/';
const endpoints = [
  'NCD_BMI_PLUS2C',
  'NCD_BMI_30A',
  'NCD_GLUC_03',
  'NCD_HYP_PREVALENCE_C',
  'SDGPM25',
  'AIR_5',
  'WSH_WATER_SAFELY_MANAGED',
  'WSH_10',
  'WHS4_544',
  'WHS4_543',
  'MCV2',
  'WHS3_62',
  'WHS3_49',
  'WHS3_53'
];

const fetchDataAndConvertToCsv = async (endpoint) => {
  try {
    const url = `${apiBaseUrl}${endpoint}`;
    const response = await axios.get(url);
    const data = response.data.value;

    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      const json2csvParser = new Parser({ fields: keys });
      const csv = json2csvParser.parse(data);

      const fileName = `output/${endpoint}.csv`;
      fs.writeFileSync(fileName, csv);
      console.log(`Data for ${endpoint} saved to ${fileName}`);
    } else {
      console.log(`No data found for ${endpoint}`);
    }
  } catch (error) {
    console.error(`Error fetching data for ${endpoint}:`, error);
  }
};

const main = async () => {
  for (const endpoint of endpoints) {
    await fetchDataAndConvertToCsv(endpoint);
  }
};

main();

