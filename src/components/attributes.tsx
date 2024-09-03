import React from "react";
import { Dropdown } from "./dropdown";
import { Checkbox } from "./checkbox";
import { Counter } from "./counter";
import { attributes } from "../data/selectors";
import { isAttrSelected, selectedAttrCount } from "../data/utils";
import { IAttribute } from "../types";

import "./attributes.scss";

interface IProps {
  selectedAttributes: IAttribute[];
  setSelectedAttributes: (attributes: IAttribute[]) => void;
}

const attributesByGroup = {
  1: attributes.filter(attribute => attribute.attributeGroupId === 1),
  2: attributes.filter(attribute => attribute.attributeGroupId === 2),
  3: attributes.filter(attribute => attribute.attributeGroupId === 3),
};

const CheckboxGroup = ({ attributesGroup, selectedAttributes, setSelectedAttributes }: { attributesGroup: IAttribute[] } & IProps) => {
  return (
    <div className="checkbox-group">
      {
        attributesGroup.map((attribute, index) => {
          const handleCheckboxChange = () => {
            if (isAttrSelected(selectedAttributes, attribute)) {
              // If the attribute is already selected, remove it
              setSelectedAttributes(selectedAttributes.filter(attr => attr.id !== attribute.id));
            } else {
              // If the attribute is not selected, add it
              setSelectedAttributes([...selectedAttributes, attribute]);
            }
          };
          return (
            <Checkbox
              key={index}
              label={attribute.name}
              checked={isAttrSelected(selectedAttributes, attribute)}
              onChange={handleCheckboxChange}
            />
          );
        })
      }
    </div>
  );
};

export const Attributes = ({ selectedAttributes, setSelectedAttributes }: IProps) => {
  return (
    <div className="attributes-section">
      <div className="attr-section-header">
        Choose attributes to include in your dataset.
      </div>
      <Dropdown label="Noncommunicable Diseases" header={<Counter value={selectedAttrCount(selectedAttributes, attributesByGroup["1"])}/>}>
        <CheckboxGroup attributesGroup={attributesByGroup["1"]} selectedAttributes={selectedAttributes} setSelectedAttributes={setSelectedAttributes} />
      </Dropdown>
      <Dropdown label="Environmental Factors and Affects" header={<Counter value={selectedAttrCount(selectedAttributes, attributesByGroup["2"])}/>}>
        <CheckboxGroup attributesGroup={attributesByGroup["2"]} selectedAttributes={selectedAttributes} setSelectedAttributes={setSelectedAttributes} />
      </Dropdown>
      <Dropdown label="Immunization & Communicable Diseases" header={<Counter value={selectedAttrCount(selectedAttributes, attributesByGroup["3"])}/>}>
        <CheckboxGroup attributesGroup={attributesByGroup["3"]} selectedAttributes={selectedAttributes} setSelectedAttributes={setSelectedAttributes} />
      </Dropdown>
    </div>
  );
};
