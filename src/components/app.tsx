import React, { useEffect, useState } from "react";
import { createItems, getDataContext, initializePlugin } from "@concord-consortium/codap-plugin-api";
import {
  createNewDataContext, deleteAllCases, kDataContextName, kInitialDimensions, kPluginName, kVersion,
  syncChildCollectionAttributes
} from "../data/codap-helpers";
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
    await deleteAllCases();

    const existingDataContext = await getDataContext(kDataContextName);
    if (!existingDataContext.success) {
      await createNewDataContext(selectedAttributes);
    } else {
      await syncChildCollectionAttributes(selectedAttributes);
    }

    const cases = await requestData({
      attributeIds: selectedAttributes.map(a => a.id),
      countryIds: selectedCountries.map(c => c.id),
      yearIds: selectedYears.map(year => year.id),
      allCountries: false,
      allYears: false,
      allCountriesInRegionIds: [],
    });
    await createItems(kDataContextName, cases);
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
