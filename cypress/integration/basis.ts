describe('basis', () => {
  // eslint-disable-next-line jest/expect-expect
  it('return 200', () => {
    cy.server()
    cy.route(/^\/v0\/posts\/streams\/global/, {
      meta: { status: 200 },
      data: [],
    })
    cy.visit('/')
    cy.contains('Welcome to Beta!')
  })
})
