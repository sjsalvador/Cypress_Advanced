// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

//import usuario from "../fixtures/data_des1";

Cypress.Commands.add("login1", () => {
    cy.fixture('dataLogin').then((login) => {      
    cy.visit('https://pushing-it.vercel.app/')
    cy.contains('Iniciá sesión').dblclick({ force: true })
    cy.get('input[data-cy="user"]').type(login.usuario);
    cy.get('input[data-cy="pass"]').type(login.pass);
    cy.get('button[data-cy="submitForm"]').click();
});
});

import './requests/product'
import './assertions/billingSummary'

Cypress.Commands.add('login', (usuario, password) => {
    cy.request({
        method: "POST",
        url: "https://pushing-it.onrender.com/api/login",
        body: {
            username: usuario,
            password: password
        },
    }).then(respuesta => {
        cy.log('respuesta', respuesta);
        window.localStorage.setItem('token', respuesta.body.token);
        window.localStorage.setItem('user', respuesta.body.user.username);
        window.localStorage.setItem('userId', respuesta.body.user._id);
        Cypress.env().token = respuesta.body.token;
    });
});