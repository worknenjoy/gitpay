'use strict'

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');
const { registerAndLogin, register, login } = require('./helpers')

describe("Roles", () => {

  beforeEach(() => {

    models.User.destroy({ where: {}, truncate: true, cascade: true }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        console.log('Deleted successfully');
      }
    }, function (err) {
      console.log(err);
    })

    models.Role.destroy({ where: {}, truncate: true, cascade: true }).then(function (rowDeleted) { // rowDeleted will return number of rows deleted
      if (rowDeleted === 1) {
        console.log('Deleted successfully');
      }
    }, function (err) {
      console.log(err);
    })
  });

  describe('find Roles', () => {
    it('should list all the roles of the user', (done) => {
        registerAndLogin(agent).then(user => {
            agent
            .get('/roles/fetch')
            .set('Authorization',user.headers.authorization)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
            expect(res.statusCode).to.equal(200)
            expect(res.body).to.exist
            done()
            })
    })
  })  
});

describe('create Roles',()=>{
    it('should create a new user role', (done)=>{
        registerAndLogin(agent).then(user => {
            agent
            .post('/roles/create')
            .send({
                name: 'funder',
                label: '0'
            })
            .set('Authorization',user.headers.authorization)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.exist;
                expect(res.body.name).to.equal('funder');
                expect(res.body.label).to.equal('0');
                done();
        })
    })
})
});

describe('update Roles',()=>{
    it('should update user roles',(done)=>{
        registerAndLogin(agent).then(user => {
            agent
            .put('/roles/create')
            .send({
                name: 'funder',
                label: '0'
            })
            .set('Authorization',user.headers.authorization)
            .then((res)=>{
                agent
                .put('/roles/update')
                .send({
                    name:'funder,maintainer'
                })
                .set('Authorization',user.headers.authorization)
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.exist;
                    expect(res.body.name).to.equal('funder,maintainer');
                    expect(res.body.label).to.equal('0');
                    done();
            })
            })
            })
    })
});
describe('delete Roles',()=>{
it('should delete user roles',(done)=>{
    registerAndLogin(agent).then(user => {
        agent
        .post('/roles/create')
        .send({
            name: 'funder',
            label: '0'
        })
        .set('Authorization',user.headers.authorization)
        .then((res)=>{
            agent
            .delete('/roles/delete')
            .set('Authorization',user.headers.authorization)
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.statusCode).to.equal(200);
                expect(res.body).to.exist;
                expect(res.body.msg).to.equal('ok');
                done();
        })
        })
        })
})
});

});
