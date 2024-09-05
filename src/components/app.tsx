import React, { useEffect, useState } from "react";
import { createChildCollection, createDataContext, createItems, createParentCollection, createTable, getDataContext, initializePlugin } from "@concord-consortium/codap-plugin-api";
import { Dropdown } from "./dropdown";
import { MainDropdownHeader } from "./main-dropdown-header";
import { Attributes } from "./attributes";
import { Countries } from "./countries";
import { Years } from "./years";
import { IAttribute, ICountry, IYear } from "../types";
import { InfoModal } from "./info-modal";
import { requestData } from "../data/request";

import InfoIcon from "../assets/info.svg";

import "./app.scss";

const kPluginName = "World Health Organization Plugin";
const kVersion = "0.0.1";
const kInitialDimensions = {
  width: 380,
  height: 520
};
const kDataContextName = "WHODataPluginData";
const kParentCollectionName = "Countries";
const kChildCollectionName = "Attributes";
const kParentCollectionAttributes = [
  {
    name: "Country",
    type: "categorical"
  },
  {
    name: "Region",
    type: "categorical"
  }
];
const kYearAttribute = {
  name: "Year",
  type: "numeric"
};

export const App = () => {
  const [selectedAttributes, setSelectedAttributes] = useState<IAttribute[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<ICountry[]>([]);
  const [selectedYears, setSelectedYears] = useState<IYear[]>([]);
  const [infoVisible, setInfoVisible] = useState(false);

  useEffect(() => {
    initializePlugin({ pluginName: kPluginName, version: kVersion, dimensions: kInitialDimensions });
  }, []);

  const handleInfoClick = () => {
    setInfoVisible(!infoVisible);
  };

  const handleCreateData = async() => {
    const existingDataContext = await getDataContext(kDataContextName);
    let createDC;
    if (!existingDataContext.success) {
      createDC = await createDataContext(kDataContextName);
    }
    if (existingDataContext?.success || createDC?.success) {
      await createParentCollection(
        kDataContextName,
        kParentCollectionName,
        kParentCollectionAttributes
      );
      // TODO: move to separate helper, add description (units, attr group?)
      const childAttributes = [
        kYearAttribute,
        ...selectedAttributes.map(a => ({ name: a.name, type: "numeric" }))
      ];
      await createChildCollection(
        kDataContextName,
        kChildCollectionName,
        kParentCollectionName,
        childAttributes
      );
      const cases = await requestData({
        attributeIds: selectedAttributes.map(a => a.id),
        countryIds: selectedCountries.map(c => c.id),
        yearIds: selectedYears.map(year => year.id),
        allCountries: false,
        allYears: false,
        allCountriesInRegionIds: [],
      });

      await createItems(kDataContextName, cases);
      await createTable(kDataContextName);
    }
  };

  return (
    <div className="app">
      <div className="app-header">
        Retrieve data from the World Health Organization for different countries or regions of the world.
        <div className="info-icon" onClick={handleInfoClick}>
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
        <Dropdown label="Years" header={<MainDropdownHeader selectedNames={selectedYears.map(c => c.name)} />}>
          <Years selectedYears={selectedYears} setSelectedYears={setSelectedYears} />
        </Dropdown>
      </div>
      <div className="app-footer">
        <div className="app-message">
        </div>
        <button onClick={handleCreateData}>Get Data</button>
      </div>
      {
        infoVisible && <InfoModal onClose={handleInfoClick} />
      }
    </div>
  );
};
