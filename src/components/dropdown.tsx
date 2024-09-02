import React, { useRef, useState } from "react";
import { clsx } from "clsx";

import ArrowDropDown from "../assets/arrow-drop-down.svg";

import "./dropdown.scss";

interface IProps {
  label: string;
  children?: React.ReactNode;
}

export const Dropdown = ({ label, children }: IProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const toggleDropdown = () => {
    if (!contentRef.current) {
      return;
    }
    if (isOpen) {
      // Set the height explicitly to the current scrollHeight before collapsing
      contentRef.current.style.height = `${contentRef.current?.scrollHeight}px`;
      // Allow the DOM to repaint before setting the height to 0
      requestAnimationFrame(() => {
        if (contentRef.current) {
          contentRef.current.style.height = "0px";
        }
      });
    } else {
      contentRef.current.style.height = `${contentRef.current?.scrollHeight}px`;
    }
    setIsOpen(!isOpen);
  };


  const handleTransitionEnd = () => {
    if (contentRef.current && isOpen) {
      contentRef.current.style.height = "auto"; // Set height to auto after the transition
    }
  };

  return (
    <div className="dropdown">
      <div className="dropdown-header" onClick={toggleDropdown}>
        <div className="dropdown-label">
          { label }
        </div>
        <div className="dropdown-icon">
          <ArrowDropDown style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0deg)" }} />
        </div>
      </div>
      <div
        ref={contentRef}
        className={clsx("dropdown-content", { isOpen })}
        onTransitionEnd={handleTransitionEnd}
      >
        { children }
      </div>
    </div>
  );
};
