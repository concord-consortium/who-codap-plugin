import React, { useEffect, useState } from "react";
import { initializePlugin } from "@concord-consortium/codap-plugin-api";
import { Dropdown } from "./dropdown";
import { MainDropdownHeader } from "./main-dropdown-header";
import { Attributes } from "./attributes";
import { Countries } from "./countries";
import { IAttribute, ICountry } from "../types";

import InfoIcon from "../assets/info.svg";

import "./app.scss";

const kPluginName = "World Health Organization Plugin";
const kVersion = "0.0.1";
const kInitialDimensions = {
  width: 380,
  height: 520
};
// const kDataContextName = "WHODataPluginData";

export const App = () => {
  const [selectedAttributes, setSelectedAttributes] = useState<IAttribute[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<ICountry[]>([]);

  useEffect(() => {
    initializePlugin({ pluginName: kPluginName, version: kVersion, dimensions: kInitialDimensions });
  }, []);

  return (
    <div className="app">
      <div className="app-header">
        Retrieve data from the World Health Organization for different countries or regions of the world.
        <div className="info-icon">
          <InfoIcon />
        </div>
      </div>
      <hr />
      <div className="app-scroll-area">
        <Dropdown label="Attributes" header={<MainDropdownHeader selectedNames={selectedAttributes.map(a => a.name)} />}>
          <Attributes selectedAttributes={selectedAttributes} setSelectedAttributes={setSelectedAttributes} />
        </Dropdown>
        <Dropdown label="Countries" header={<MainDropdownHeader selectedNames={selectedCountries.map(c => c.name)} />}>
          <Countries selectedCountries={selectedCountries} setSelectedCountries={setSelectedCountries} />
        </Dropdown>
        <Dropdown label="Years">
          TODO
        </Dropdown>
      </div>
      <div className="app-footer">
        <div className="app-message">
        </div>
        <button>Get Data</button>
      </div>
    </div>
  );
};
