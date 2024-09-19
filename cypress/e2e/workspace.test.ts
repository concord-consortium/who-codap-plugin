import { AppElements as ae } from "../support/elements/app-elements";

context("Test the overall app in CODAP v3", () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe("Desktop functionalities", () => {
    it("renders Get Data button", () => {
      ae.getApp().find("button").should("have.text", "Get Data");
    });
    it.skip("renders Get Data button in CODAP", () => {
      cy.visit('https://codap3.concord.org');

      // Use cy.origin to target a different origin
      cy.origin('https://codap3.concord.org', () => {
        // All commands targeting codap3.concord.org should be wrapped inside this block
        cy.get('#codap-menu-bar-id .cfm-menu.menu-anchor').click();
        // Assuming the menu is already visible or triggered open
      cy.get('.cfm-menu .menuItem').contains('Import...').click();
      // Ensure the modal dialog is visible
      cy.get('.modal-dialog[data-testid="modal-dialog"]').should('be.visible');
      // Click the "URL" tab to switch to the URL import option
      cy.get('.workspace-tabs ul li').contains('URL').click();
      // Ensure the URL import tab is visible
      cy.get('.dialogTab.urlImport').should('be.visible');

      // Find the URL input field and type the Cypress base URL
      cy.get('.dialogTab.urlImport input[placeholder="URL"]').type(Cypress.config('baseUrl'));
      // Click on the "Import" button
      // this would have been a beautiful thing to have if the Import button was functional :-/
      cy.get('.dialogTab.urlImport .buttons button').contains('Import').click();
      //ae.getApp().find("button").should("have.text", "Get Data");

      });

    });
  });
});
