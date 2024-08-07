import React from "react";
import { App } from "./app";
import { render, screen } from "@testing-library/react";

describe("test load app", () => {
  it("renders without crashing", () => {
    render(<App/>);
    expect(screen.getByText("WHO CODAP Plugin")).toBeDefined();
  });
});

