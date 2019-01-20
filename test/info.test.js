'use strict';

const assert = require('assert')
const request = require('supertest')
const expect = require('chai').expect
const api = require('../server');
const agent = request.agent(api);
const models = require('../models');

describe("info", () => {
    beforeEach(() => {
        models.Task.destroy({where:{}, truncate: true, cascade: true})
        models.User.destroy({where:{}, truncate: true, cascade: true})
    })
    
    describe('with no models in database', () => {
    
        it('should return zero tasks', (done) => {
            
        agent
            .get('/info/all')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
            expect(res.body.tasks).to.equal(0);
            done();
            })
        })

        it('should return zero bounties', (done) => {
            
            agent
            .get('/info/all')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body.bounties).to.equal(0);
                done();
            })
        })

        it('should return zero users', (done) => {
            
            agent
            .get('/info/all')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                expect(res.body.users).to.equal(0);
                done();
            })
        })
  })

  describe('with task in database', () => {
      describe('that is not paid', () => {
        it('should return no bounty', (done) => {
            models.Task.build({value: 10, paid: false}).save()
            .then((task) => {        
                agent
                    .get('/info/all')
                    .expect('Content-Type', /json/)
                    .expect(200)
                    .end((err, res) => {
                    expect(res.body.bounties).to.equal(0);
                    done();
                    })
                })
            })
        })
        
        describe('that is paid', () => {
            it('should return the sum of all bounties', (done) => {
                models.Task.bulkCreate([{value: 10, paid: true}, {value: 10, paid: true}])
                .then((task) => {        
                    agent
                        .get('/info/all')
                        .expect('Content-Type', /json/)
                        .expect(200)
                        .end((err, res) => {
                        expect(res.body.bounties).to.equal(20);
                        done();
                        })
                    })
                })
            })
        })
    })
