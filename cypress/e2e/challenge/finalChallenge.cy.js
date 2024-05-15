import datosProducto from "./datos";
import datosCard from "./datoscard";
import { TIMEOUT } from "../../fixtures/constantes"

describe("Advanced Cypress - Final Challenge", () => {

  before(() => {
    cy.login(Cypress.env().usuario, Cypress.env().password);
    cy.visit('');
    cy.eliminarProducto(datosProducto.producto2.id);
    cy.eliminarProducto(datosProducto.producto3.id);
    cy.crearProducto(datosProducto.producto2);
    cy.crearProducto(datosProducto.producto3);
  });


  it('Agrego productos al carrito y lo verifico', () => {
    //Ingresando a OnlineShop
    cy.login(Cypress.env().usuario, Cypress.env().password,);
    cy.visit('');
    cy.get('a[data-cy="onlineshoplink"]', { timeout: TIMEOUT }).click()

    //Busco producto 2 por su ID
    cy.buscarProducto(datosProducto.producto2.id, datosProducto.producto2.name);

    //Agrego producto 2 al carrito de compras
    cy.agregarCarrito(datosProducto.producto2.id);

    //Busco producto 3 por su ID
    cy.buscarProducto(datosProducto.producto3.id, datosProducto.producto2.name);

    //Agrego producto 3 al carrito de compras
    cy.agregarCarrito(datosProducto.producto3.id);

    //Busco producto 2 por su ID
    cy.buscarProducto(datosProducto.producto2.id, datosProducto.producto2.name);

    //Agrego producto 2 al carrito de compras
    cy.agregarCarrito(datosProducto.producto2.id);

    //Busco producto 3 por su ID
    cy.buscarProducto(datosProducto.producto3.id, datosProducto.producto3.name);

    //Agrego producto 3 al carrito de compras
    cy.agregarCarrito(datosProducto.producto3.id);

    //Voy al Sopping Cart
    cy.get('[data-cy="goShoppingCart"]', { timeout: TIMEOUT }).click();


    //Verifico los Items del carrito
    cy.get('li', { timeout: TIMEOUT }).eq(0).within(() => {
      cy.get('p', { timeout: TIMEOUT }).eq(0).should('contain', `2`);
      cy.get('p', { timeout: TIMEOUT }).eq(1).should('contain', `${datosProducto.producto2.name}`);
      cy.get('p', { timeout: TIMEOUT }).eq(2).should('contain', `${datosProducto.producto2.price}`);
      cy.get('p', { timeout: TIMEOUT }).eq(3).should('contain', `${datosProducto.producto2.price * 2}`);
    })

    cy.get('li', { timeout: TIMEOUT }).eq(1).within(() => {
      cy.get('p', { timeout: TIMEOUT }).eq(0).should('contain', `2`);
      cy.get('p', { timeout: TIMEOUT }).eq(1).should('contain', `${datosProducto.producto3.name}`);
      cy.get('p', { timeout: TIMEOUT }).eq(2).should('contain', `${datosProducto.producto3.price}`);
      cy.get('p', { timeout: TIMEOUT }).eq(3).should('contain', `${datosProducto.producto3.price * 2}`);
    })

    //Mostrar el precio total y verificarlo
    cy.get('button').contains("Show total price").click();
    cy.get('[id="price"]', { timeout: TIMEOUT }).should('contain', `${datosProducto.producto2.price * 2 + datosProducto.producto3.price * 2}`);

    //Ir al billing summary
    cy.get('button').contains("Go to Billing Summary").click();

    cy.verificarBillSummary({
      subtotal: `${datosProducto.producto2.price * 2 + datosProducto.producto3.price * 2}`,
      freight: 'Free',
      total: `${datosProducto.producto2.price * 2 + datosProducto.producto3.price * 2}`
    });

    //Hago el Checkout
    cy.get('[data-cy="goCheckout"]', { timeout: TIMEOUT }).click();

    // //Completo datos de la compra y reviso datos en la base de datos
    cy.get('[data-cy="firstName"]', { timeout: TIMEOUT }).type(datosCard.card.firstName);
    cy.get('[data-cy="lastName"]', { timeout: TIMEOUT }).type(datosCard.card.lastName);
    cy.get('[data-cy="cardNumber"]', { timeout: TIMEOUT }).type(datosCard.card.cardNumber);
    cy.get('[data-cy="purchase"]', { timeout: TIMEOUT }).click();

    // Verifico la confirmacion de la orden
    cy.get('[data-cy="totalPrice"]', { timeout: TIMEOUT }).should('be.visible').and('contain', `${datosProducto.producto2.price * 2 + datosProducto.producto3.price * 2}`);

    // Agrego un wait para asegurarme que la pagina esta completamente cargada antes de continuar
    cy.wait(3000);

    // Realizo un creenshot para confirmar la orden
    cy.screenshot('order-confirmation');

    // Reviso con la base de datos la confirmacion de la orden
    cy.get('[data-cy="sellId"]', { timeout: TIMEOUT }).invoke('text').then(function (sellId) {
      this.sellId = sellId
      const query = `SELECT * FROM public."purchaseProducts" INNER JOIN public."sells" ON public."purchaseProducts".sell_id = public."sells".id WHERE sell_id=${this.sellId};`
      cy.task("connectDB", query).then(function (result) {
        cy.log(result);
        expect(result[0].id).to.equal(parseInt(this.sellId));
        expect(result[1].id).to.equal(parseInt(this.sellId));
        expect(result[0].cardNumber).to.equal(datosCard.card.cardNumber);
        expect(result[1].cardNumber).to.equal(datosCard.card.cardNumber);

      })
    })
  })
})



