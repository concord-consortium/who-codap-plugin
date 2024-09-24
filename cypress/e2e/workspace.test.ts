import { AppElements as ae } from "../support/elements/app-elements";
import { getInIframe as getIframeContent } from "../support/elements/iframe";

const baseUrl = `${Cypress.config("baseUrl")}`;

context("Test the overall app in CODAP v3", () => {
  beforeEach(() => {
    cy.visit("");
  });

  describe("Desktop functionalities", () => {
    it("renders Get Data button", () => {
      // ae.getApp().find("button").should("have.text", "Get Data");
      ae.getDatabutton().should("have.text", "Get Data");
    });

    describe("CODAP Plugin Test", () => {
      it.skip("renders in CODAP", () => {
        cy.visit("https://codap3.concord.org");

        // Use cy.origin to target a different origin
        cy.origin("https://codap3.concord.org", () => {
          cy.get("[data-testid=tool-shelf-button-options]").should('be.visible').click();
          cy.get("[data-testid=tool-shelf-button-web-view]").should('be.visible').click();

          cy.get("[data-testid=web-view-url-input]").should('be.visible').clear();
          cy.get("[data-testid=web-view-url-input]").type(Cypress.config('baseUrl'));

          cy.get("[data-testid=OK-button]").should('be.visible').click();
          cy.wait(1500); // Wait for any transitions or load times after clicking OK

          // Use getIframeContent to find and interact with an element inside the iframe
          cy.getPluginIframe().find("body", ".app-header")
            .should('contain.text', 'Retrieve data from the World Health Organization');

          // // You can also use it to interact with other elements within the iframe
          // getIframeContent("body", "[data-cy=choices-container] input")
          //   .eq(1)
          //   .click({ force: true });

          // cy.wait(3000); // Add any necessary wait time for actions to complete

          // // Reload the page or iframe and check persistence
          // cy.visit("https://codap3.concord.org");
          // getIframeContent("body", "[data-cy=choices-container] input")
          //   .eq(1)
          //   .should("be.checked");
        });
      });
    });
  });
});