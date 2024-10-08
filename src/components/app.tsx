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
import { attributes } from "../data/selectors";
import { isDataComplete } from "../data/utils";

import InfoIcon from "../assets/info.svg";
import ProgressIndicator from "../assets/progress-indicator.svg";
import DoneIcon from "../assets/done.svg";
import WarningIcon from "../assets/warning.svg";

import "./app.scss";

type DataStatus = "" | "retrieving" | "retrieved" | "incomplete";

export const App = () => {
  const [selectedAttributes, setSelectedAttributes] = useState<IAttribute[]>([]);
  const [selectedCountries, setSelectedCountries] = useState<ICountry[]>([]);
  const [selectedYears, setSelectedYears] = useState<IYear[]>([]);
  const [infoVisible, setInfoVisible] = useState(false);
  const [dataStatus, setDataStatus] = useState<DataStatus>("");

  const getDataDisabled = dataStatus === "retrieving";
  useEffect(() => {
    initializePlugin({ pluginName: kPluginName, version: kVersion, dimensions: kInitialDimensions });
  }, []);

  const handleInfoClick = () => {
    setInfoVisible(!infoVisible);
  };

  const handleCreateData = async() => {
    if (dataStatus === "retrieving") {
      return;
    }
    setDataStatus("retrieving");

    await deleteAllCases();

    const tableAttributes = selectedAttributes.length === 0 ? attributes : selectedAttributes;
    const existingDataContext = await getDataContext(kDataContextName);
    if (!existingDataContext.success) {
      await createNewDataContext(tableAttributes);
    } else {
      await syncChildCollectionAttributes(tableAttributes);
    }

    const cases = await requestData({
      attributeIds: selectedAttributes.map(a => a.id),
      countryIds: selectedCountries.map(c => c.id),
      yearIds: selectedYears.map(year => year.id)
    });
    await createItems(kDataContextName, cases);

    setDataStatus(isDataComplete(cases, tableAttributes) ? "retrieved" : "incomplete");
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
          {
            dataStatus === "retrieving" &&
            <div className="progress-indicator"><ProgressIndicator /> Retrieving data...</div>
          }
          {
            dataStatus === "retrieved" && <div className="done"><DoneIcon /> Retrieved data</div>
          }
          {
            dataStatus === "incomplete" && <div className="incomplete"><WarningIcon /> Some data requested are not available</div>
          }
        </div>
        <button onClick={handleCreateData} disabled={getDataDisabled}>Get Data</button>
      </div>
      {
        infoVisible && <InfoModal onClose={handleInfoClick} />
      }
    </div>
  );
};
