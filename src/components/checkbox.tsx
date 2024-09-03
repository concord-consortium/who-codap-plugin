import React from "react";

import CheckboxOutline from "../assets/check-box-outline.svg";
import CheckboxChecked from "../assets/check-box.svg";

import "./checkbox.scss";

interface IProps {
  label?: string;
  checked?: boolean;
  onChange?: () => void;
}

export const Checkbox = ({ label, checked, onChange }: IProps) => {
  return (
    <div className="checkbox" onClick={onChange}>
      <div className="checkbox-icon">{ checked ? <CheckboxChecked /> : <CheckboxOutline /> }</div>
      <div className="checkbox-label">{ label }</div>
    </div>
  );
};
