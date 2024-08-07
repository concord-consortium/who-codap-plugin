import { requestData } from "./request";
import { rawDataValueRows } from "./values";

describe("request", () => {
  it("returns filtered rows", async () => {
    const data = await requestData({
      attributeIds: [1],
      countryIds: [49, 70],
      allCountries: false,
      allCountriesInRegionIds: [],
      yearIds: [1, 2, 3],
      allYears: false,
    });
    expect(data.length).toBe(6);
    expect(data).toStrictEqual(      [
      {
        attribute: "Obesity, Children (5-9 yr)",
        attributeGroup: "Noncommunicable Diseases",
        units: "Percentage",
        country: "Afghanistan",
        region: "Eastern Mediterranean Region",
        year: "2022",
        value: 9.56
      },
      {
        attribute: "Obesity, Children (5-9 yr)",
        attributeGroup: "Noncommunicable Diseases",
        units: "Percentage",
        country: "Afghanistan",
        region: "Eastern Mediterranean Region",
        year: "2021",
        value: 8.9
      },
      {
        attribute: "Obesity, Children (5-9 yr)",
        attributeGroup: "Noncommunicable Diseases",
        units: "Percentage",
        country: "Afghanistan",
        region: "Eastern Mediterranean Region",
        year: "2020",
        value: 8.27
      },
      {
        attribute: "Obesity, Children (5-9 yr)",
        attributeGroup: "Noncommunicable Diseases",
        units: "Percentage",
        country: "Albania",
        region: "European Region",
        year: "2022",
        value: 11.23
      },
      {
        attribute: "Obesity, Children (5-9 yr)",
        attributeGroup: "Noncommunicable Diseases",
        units: "Percentage",
        country: "Albania",
        region: "European Region",
        year: "2021",
        value: 10.95
      },
      {
        attribute: "Obesity, Children (5-9 yr)",
        attributeGroup: "Noncommunicable Diseases",
        units: "Percentage",
        country: "Albania",
        region: "European Region",
        year: "2020",
        value: 10.68
      }
    ]);
    expect(rawDataValueRows.length).toBe(330);
  });
});
