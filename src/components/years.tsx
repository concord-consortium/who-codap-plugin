import React from "react";
import { Checkbox } from "./checkbox";
import { years } from "../data/selectors";
import { isAttrSelected, selectedAttrCount } from "../data/utils";
import { IYear } from "../types";

import "./years.scss";

interface IProps {
  selectedYears: IYear[];
  setSelectedYears: (years: IYear[]) => void;
}

const CheckboxGroup = ({ selectedYears, setSelectedYears }: IProps) => {
  const handleAllYearsCheckboxChange = () => {
    if (selectedAttrCount(selectedYears, years) === years.length) {
      // If all years are already selected, remove them
      setSelectedYears([]);
    } else {
      // If not all years are selected, add them
      setSelectedYears([...years]);
    }
  };

  return (
    <div className="checkbox-group">
      <div className="all-years-checkbox-container">
        <Checkbox
          label="All years"
          checked={selectedAttrCount(selectedYears, years) === years.length}
          onChange={handleAllYearsCheckboxChange}
        />
      </div>
      {
        years.map((year, index) => {
          const handleCheckboxChange = () => {
            if (isAttrSelected(selectedYears, year)) {
              // If the year is already selected, remove it
              setSelectedYears(selectedYears.filter(attr => attr.id !== year.id));
            } else {
              // If the year is not selected, add it
              setSelectedYears([...selectedYears, year]);
            }
          };
          return (
            <div key={index} className="checkbox-container">
              <Checkbox
                label={year.name}
                checked={isAttrSelected(selectedYears, year)}
                onChange={handleCheckboxChange}
              />
            </div>
          );
        })
      }
    </div>
  );
};

export const Years = ({ selectedYears, setSelectedYears }: IProps) => {
  return (
    <div className="years-section">
      <div className="years-section-header">
        Choose which year(s) to include in your dataset.
      </div>
        <CheckboxGroup selectedYears={selectedYears} setSelectedYears={setSelectedYears} />
    </div>
  );
};
