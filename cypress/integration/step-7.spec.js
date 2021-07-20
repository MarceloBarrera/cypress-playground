/// <reference types="Cypress" />

const userSeed = require('../../server/seed/users')

context.only('BirdBoard', () => {
  beforeEach(() => {
    // Prepare database
    cy.task('clear:db')
    cy.task('seed:db', userSeed.data)

    // Visit Login page
    cy.visit('http://localhost:8080/login')

    // Login to account
    cy.login('amir@cypress.io', '1234')
  })

  /** It is better to use new method from Cypress Intercept */
  it('load tweets for selected hashtags', () => {
    cy.server()

    // Fixture is stored in cypress/fixtures/tweets.json
    cy.fixture('tweets').then((tweets) => {
      console.log('tweets::::::', tweets);
      cy.route({
        url: '/tweets*',
        response: tweets,
        // delay: 3000, // simulate slow response
        status: 200
      })
      .as('tweets')
    })

    cy.intercept('/tweets',)
    cy.get('#hashtags')
      .type('javascript{enter}')
      .type('cypressio{enter}')

    cy.window().then(win => {
      cy.wait('@tweets').then((response)=>{
        console.log(response);
      })
        .its('response.body.tweets')
        .should('have.length', win.app.$store.state.tweets.length)
    })
  })
})
