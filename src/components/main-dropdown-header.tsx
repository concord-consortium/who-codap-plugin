import React from "react";
import { Counter } from "./counter";

import "./main-dropdown-header.scss";

interface IProps {
  selectedNames: string[];
}

export const MainDropdownHeader = ({ selectedNames }: IProps) => {
  if (selectedNames.length === 0) {
    return null;
  }
  return (
    <div className="main-dropdown-header">
      <div className="main-dropdown-header-counter-container">
        <Counter value={selectedNames.length} />
      </div>
      <div className="main-dropdown-header-names">
        { selectedNames.join("; ") }
      </div>
    </div>
  );
};
