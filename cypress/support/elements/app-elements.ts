export const AppElements = {
  getApp() {
    return cy.get(".app");
  },
  getDatabutton() {
    return cy.get('[data-testid="who-get-data-button"]');
  }
};
