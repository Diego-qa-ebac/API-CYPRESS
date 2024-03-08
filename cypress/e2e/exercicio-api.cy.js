/// <reference types="cypress" />
import contrato from '../contracts/produtos.contrato'

describe('Testes da Funcionalidade Usuários', () => {

    let token 
    beforeEach(() => {
        cy.token('beltrano@qa.com.br', 'teste').then(tkn =>{
            token = tkn
        } )
    });

  it('Deve validar contrato de usuários', () => {
      cy.request('usuarios').then(response => {
        return contrato.validateAsync()
      })
  });

  it('Deve listar usuários cadastrados', () => {
        cy.request({
          method: 'GET',
          url: 'usuarios',
        }).should((response) => {
          expect(response.status).to.equal(200)
          expect(response.body).to.have.property('usuarios')
        })    
  });

  it('Deve cadastrar um usuário com sucesso', () => {
        let usuario = 'Aluno.EBAC' + Math.floor(Math.random() * 10000000000)
        let emails = 'estudante.ebac' + Math.floor(Math.random() * 10000000000) + '@ebac.com.br'
        cy.cadastrarUsuario(token,usuario, emails, 'teste')
        .should((response) => {
          expect(response.status).equal(201)
          expect(response.body.message).equal('Cadastro realizado com sucesso')
        })
  });

  it('Deve validar um usuário com email inválido', () => {
        cy.request({
        method: 'POST',
        url: 'usuarios',
        headers: {authorization:token},
        body: {

        "nome": 'fulano@qa.com.br',
        "email": 'beltrano@qa.com.br',
        "password": "teste",
        "administrador": "true"
      },failOnStatusCode: false
    }).should((response) => {
        expect(response.status).equal(400)
        expect(response.body.message).equal('Este email já está sendo usado')
    }) 
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let usuario = 'Aluno.EBAC.EDITADO' + Math.floor(Math.random() * 10000000000)
    let emails = 'estudante.ebac' + Math.floor(Math.random() * 10000000000) + '@ebac.com.br'
        cy.cadastrarUsuario(token,usuario, emails, 'testeEDITADO')
        .then(response => {
          let id = response.body._id
          cy.request({
            method: 'PUT',
            url: `usuarios/${id}`,
            headers: {authorization:token},
            body: {
              "nome": usuario,
              "email": emails,
              "password": "testeEditado",
              "administrador": "true"
            } 
        }).should((response) => {
              expect(response.body.message).to.equal('Registro alterado com sucesso')
              expect(response.status).to.equal(200)
          })
        })    
  })

  it('Deve deletar um usuário previamente cadastrado', () => {
      cy.cadastrarUsuario(token,'Usuario pra ser DELETADO','beltrano@qa.com.br', 'teste')
        .then(response =>{
          let id = response.body._id
          cy.request({
            method: 'DELETE',
            url: `usuarios/${id}`,
            headers: {authorization: token}
          }).should(response => {
            expect(response.status).to.equal(200)
          })
        })

        })

  });


