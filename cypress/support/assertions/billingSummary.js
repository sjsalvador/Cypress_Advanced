Cypress.Commands.add('verificarBillSummary', ({ subtotal, freight, total }) => {
    const TIMEOUT = 60000;
    cy.get('[data-cy="subtotalAmount"]', { timeout: TIMEOUT }).should('contain', subtotal);
    cy.get('[data-cy="freightAmount"]', { timeout: TIMEOUT }).should('contain', freight);
    cy.get('[data-cy="totalPriceAmount"]', { timeout: TIMEOUT }).should('contain', total);
});

