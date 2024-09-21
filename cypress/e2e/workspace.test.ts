import { AppElements as ae } from "../support/elements/app-elements";

context("Test the overall app in CODAP v3", () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe("Desktop functionalities", () => {
    it("renders Get Data button", () => {
      ae.getApp().find("button").should("have.text", "Get Data");
    });
    it.skip("renders in CODAP", () => {
      cy.visit("https://codap3.concord.org");

      // Use cy.origin to target a different origin
      cy.origin("https://codap3.concord.org", () => {
      // Ensure the iFrame content is fully loaded before interacting
      cy.get("[data-testid=tool-shelf-button-options]").should('be.visible').click();
      cy.get("[data-testid=tool-shelf-button-web-view]").should('be.visible').click();
      
      cy.get("[data-testid=web-view-url-input]").should('be.visible').clear();
      cy.get("[data-testid=web-view-url-input]").type(Cypress.config('baseUrl'));
      
      cy.get("[data-testid=OK-button]").should('be.visible').click();
      cy.wait(1500); // Wait for any transitions or load times after clicking OK

      // Verifying that specific elements are visible in the iFrame
      // cy.get('.app-header')
      //   .contains('Retrieve data from the World Health Organization for different countries or regions of the world.')
      //   .should('be.visible');
      // cy.get('[data-testid="dropdown-countries"]').should('be.visible');
      // cy.get('[data-testid="attributes-header"]').should('be.visible');
      
      // // Scroll and click the "Get Data" button
      // cy.get('[data-testid="who-get-data-button"]').scrollIntoView().should('be.visible').click();
    });
  });
});
});
