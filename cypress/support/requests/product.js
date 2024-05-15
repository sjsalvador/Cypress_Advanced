import { TIMEOUT } from "../../fixtures/constantes"

Cypress.Commands.add('eliminarProducto', (id) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${id}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).its('body.products.docs').each((product) => {
        cy.request({
            method: "DELETE",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`,
            }
        });
    });

});

Cypress.Commands.add('crearProducto', (body) => {
    cy.request({
        method: "POST",
        url: `${Cypress.env().baseUrlAPI}/create-product`,
        body: body,
    });
});

Cypress.Commands.add('editarProducto', (id, body) => {
    cy.request({
        method: "GET",
        url: `${Cypress.env().baseUrlAPI}/products?id=${id}`,
        failsOnStatusCode: false,
        headers: {
            Authorization: `Bearer ${Cypress.env().token}`
        }
    }).its('body.products.docs').each((product) => {
        cy.request({
            method: "PUT",
            url: `${Cypress.env().baseUrlAPI}/product/${product._id}`,
            body: body,
            headers: {
                Authorization: `Bearer ${Cypress.env().token}`,
            }
        });
    });

});


Cypress.Commands.add('buscarProducto', (productoId, productoName) => {
    cy.get('[data-cy="search-type"]', { timeout: TIMEOUT }).select('ID');
    cy.get('input[data-cy="search-bar"]').clear().type(`${productoId}{enter}`);
    cy.get('[data-cy="name"]', { timeout: TIMEOUT }).should('contain', `${productoName}`);   
});


Cypress.Commands.add('agregarCarrito', (productoId2) => {
    cy.get(`[data-cy^="add-to-cart-${productoId2}"]`).click();
    cy.get('[data-cy="closeModal"]').click();
});



