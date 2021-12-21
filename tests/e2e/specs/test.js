/// <reference types="Cypress" />
// https://docs.cypress.io/api/introduction/api.html

// describe it 测试语法 mocha
describe('用户登陆', () => {
  it('登陆成功，跳转首页', () => {
    // 断言语法 chai
    cy.visit('#/login')
    cy.get('input[data-testid="phone"]')
      .clear()
      .type('18201288771')
    cy.get('input[data-testid="password"]')
      .clear()
      .type('111111')
    cy.get('button[data-testid="submit"]')
      .click()
  })
})
