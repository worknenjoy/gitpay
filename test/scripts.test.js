const expect = require('chai').expect
const chai = require('chai')
const spies = require('chai-spies')
const Promise = require('bluebird')
const api = require('../server')
const models = require('../models')
const nock = require('nock')
const request = require('supertest')
const agent = request.agent(api)
const SendMail = require('../modules/mail/mail')
const { scripts } = require('../scripts')

describe('Scripts', () => {
  beforeEach(() => {
    models.Task.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
    models.Order.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
    nock.cleanAll()
  })

  describe('Scripts', () => {
    it('Check for invalid tasks and delete it', (done) => {
      agent
        .post('/auth/register')
        .send({email: 'testscripts@gitpay.me', password: 'teste'})
        .expect('Content-Type', /json/)
        .expect(200)
        .end((err, res) => {
          Promise.all([
            models.Task.build({provider: 'github', url: 'https://github.com/worknenjoy/truppie/issues/120', userId: res.body.id}).save(),
            models.Task.build({provider: 'github', url: 'https://github.com/worknenjoy/truppie/issues/130', userId: res.body.id, status: 'in_progress'}).save(),
            models.Task.build({provider: 'github', url: 'https://github.com/worknenjoy/truppie/issues/143', userId: res.body.id, status: 'closed', value: 100}).save(),
            models.Task.build({provider: 'github', url: 'https://github.com/worknenjoy/truppie/issues/7366', userId: res.body.id}).save(),
            models.Task.build({provider: 'github', url: 'https://github.com/worknenjoy/truppie/issues/test', userId: res.body.id, value: 50}).save()
          ]).then( tasks => {
            chai.use(spies)
            const mailSpySuccess = chai.spy.on(SendMail, 'success')
            scripts.deleteInvalidTasks().then(result => {
              const resulUrls = result.map(r => r.dataValues.url)
              expect(resulUrls).to.include('https://github.com/worknenjoy/truppie/issues/7366')
              expect(resulUrls).to.include('https://github.com/worknenjoy/truppie/issues/test')
              const deletedArrays = [
                models.Task.findOne({where: {url: 'https://github.com/worknenjoy/truppie/issues/7366'}}),
                models.Task.findOne({where: {url: 'https://github.com/worknenjoy/truppie/issues/test'}}),
                models.Task.findOne({where: {url: 'https://github.com/worknenjoy/truppie/issues/120'}}),
                models.Task.findOne({where: {url: 'https://github.com/worknenjoy/truppie/issues/130'}}),
                models.Task.findOne({where: {url: 'https://github.com/worknenjoy/truppie/issues/143'}})
              ]
              Promise.all(deletedArrays).then((deletedTasks) => {
                expect(deletedTasks[0]).to.equal(null)
                expect(deletedTasks[1]).to.equal(null)
                expect(deletedTasks[2]).not.to.equal(null)
                expect(deletedTasks[3]).not.to.equal(null)
                expect(deletedTasks[4]).not.to.equal(null)
                expect(mailSpySuccess).to.have.been.called()
                done()
              })
            })
          })
        })
      })
    })
})
