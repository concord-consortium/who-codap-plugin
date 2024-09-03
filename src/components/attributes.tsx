import React from "react";
import { Dropdown } from "./dropdown";
import { Checkbox } from "./checkbox";
import { Counter } from "./counter";
import { attributeGroups, attributes } from "../data/selectors";
import { isAttrSelected, selectedAttrCount } from "../data/utils";
import { IAttribute } from "../types";

import "./attributes.scss";

interface IProps {
  selectedAttributes: IAttribute[];
  setSelectedAttributes: (attributes: IAttribute[]) => void;
}

interface IAttributeGroupWithAttributes {
  id: number;
  name: string;
  attributes: IAttribute[];
}

const attributeGroupWithAttributes: IAttributeGroupWithAttributes[] = attributeGroups.map(group => {
  return {
    ...group,
    attributes: attributes.filter(attr => attr.attributeGroupId === group.id)
  };
});

const CheckboxGroup = ({ attributeGroup, selectedAttributes, setSelectedAttributes }: { attributeGroup: IAttributeGroupWithAttributes } & IProps) => {
  return (
    <div className="checkbox-group">
      {
        attributeGroup.attributes.map((attribute, index) => {
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
      {
        attributeGroupWithAttributes.map((group, index) => {
          return (
            <Dropdown key={index} label={group.name} header={<Counter value={selectedAttrCount(selectedAttributes, group.attributes)} />}>
              <CheckboxGroup attributeGroup={group} selectedAttributes={selectedAttributes} setSelectedAttributes={setSelectedAttributes} />
            </Dropdown>
          );
        })
      }
    </div>
  );
};
