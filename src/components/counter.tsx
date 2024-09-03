import React from "react";

import "./counter.scss";

export const Counter = ({ value }: { value: number }) => {
  return (
    <div className="counter">
      { value }
    </div>
  );
};
