import React from "react";
import { Dropdown } from "./dropdown";
import { Checkbox } from "./checkbox";
import { Counter } from "./counter";
import { regions, countries } from "../data/selectors";
import { isAttrSelected, selectedAttrCount } from "../data/utils";
import { ICountry } from "../types";

import "./countries.scss";

interface IProps {
  selectedCountries: ICountry[];
  setSelectedCountries: (countries: ICountry[]) => void;
}

interface IRegionWithCountries {
  id: number;
  name: string;
  countries: ICountry[];
}

const regionsWithCountries: IRegionWithCountries[] = regions.map(region => {
  return {
    ...region,
    countries: countries.filter(country => country.regionId === region.id)
  };
});

const CheckboxGroup = ({ region, selectedCountries, setSelectedCountries }: { region: IRegionWithCountries } & IProps) => {
  const handleAllCountriesCheckboxChange = () => {
    if (selectedAttrCount(selectedCountries, region.countries) === region.countries.length) {
      // If all countries are already selected, remove them
      setSelectedCountries(selectedCountries.filter(country => !region.countries.some(regCountry => regCountry.id === country.id)));
    } else {
      // If not all countries are selected, add them without duplicates
      setSelectedCountries([...selectedCountries, ...region.countries.filter(country => !isAttrSelected(selectedCountries, country))]);
    }
  };

  return (
    <div className="checkbox-group">
      <div className="all-countries-checkbox-container">
        <Checkbox
          label={`All countries in ${region.name}`}
          checked={selectedAttrCount(selectedCountries, region.countries) === region.countries.length}
          onChange={handleAllCountriesCheckboxChange}
        />
      </div>
      {
        region.countries.map((country, index) => {
          const handleCheckboxChange = () => {
            if (isAttrSelected(selectedCountries, country)) {
              // If the country is already selected, remove it
              setSelectedCountries(selectedCountries.filter(attr => attr.id !== country.id));
            } else {
              // If the country is not selected, add it
              setSelectedCountries([...selectedCountries, country]);
            }
          };
          return (
            <div key={index} className="checkbox-container">
              <Checkbox
                label={country.name}
                checked={isAttrSelected(selectedCountries, country)}
                onChange={handleCheckboxChange}
              />
            </div>
          );
        })
      }
    </div>
  );
};

export const Countries = ({ selectedCountries, setSelectedCountries }: IProps) => {
  return (
    <div className="countries-section">
      <div className="countries-section-header">
        Choose countries to include in your dataset
      </div>
      {
        regionsWithCountries.map((region, index) => {
          return (
            <Dropdown key={index} label={region.name} header={<Counter value={selectedAttrCount(selectedCountries, region.countries)} />}>
              <CheckboxGroup region={region} selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />
            </Dropdown>
          );
        })
      }
    </div>
  );
};
