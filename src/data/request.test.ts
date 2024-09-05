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
    expect(data).toStrictEqual([
      {
        Year: "2022",
        Country: "Afghanistan",
        Region: "Eastern Mediterranean Region",
        "Obesity, Children (5-9 yr)": 9.56
      },
      {
        Year: "2021",
        Country: "Afghanistan",
        Region: "Eastern Mediterranean Region",
        "Obesity, Children (5-9 yr)": 8.9
      },
      {
        Year: "2020",
        Country: "Afghanistan",
        Region: "Eastern Mediterranean Region",
        "Obesity, Children (5-9 yr)": 8.27
      },
      {
        Year: "2022",
        Country: "Albania",
        Region: "European Region",
        "Obesity, Children (5-9 yr)": 11.23
      },
      {
        Year: "2021",
        Country: "Albania",
        Region: "European Region",
        "Obesity, Children (5-9 yr)": 10.95
      },
      {
        Year: "2020",
        Country: "Albania",
        Region: "European Region",
        "Obesity, Children (5-9 yr)": 10.68
      }
    ]);
    expect(rawDataValueRows.length).toBe(330);
  });
});
