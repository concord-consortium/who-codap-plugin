import { AppElements as ae } from "../support/elements/app-elements";

context("Test the overall app", () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe("Desktop functionalities", () => {
    it("renders Get Data button", () => {
      ae.getApp().find("button").should("have.text", "Get Data");
    });
  });
});
