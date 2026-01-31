import { expect } from 'chai'
import request from 'supertest'
import api from '../src/server'
import Models from '../src/models'

const agent = request.agent(api)
const models = Models as any

xdescribe('info', () => {
  beforeEach(async () => {
    await models.Task.destroy({ where: {}, truncate: true, cascade: true })
    await models.User.destroy({ where: {}, truncate: true, cascade: true })
  })

  describe('with no models in database', () => {
    it('should return zero tasks', async () => {
      const res = await agent
        .get('/info/all')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.tasks).to.equal(0)
    })

    it('should return zero bounties', async () => {
      const res = await agent
        .get('/info/all')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.bounties).to.equal(0)
    })

    it('should return zero users', async () => {
      const res = await agent
        .get('/info/all')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.users).to.equal(0)
    })
  })

  describe('with task in database', () => {
    describe('that is not paid', () => {
      it('should return no bounty', async () => {
        await models.Task.build({ value: 10, paid: false }).save()
        
        const res = await agent
          .get('/info/all')
          .expect('Content-Type', /json/)
          .expect(200)

        expect(res.body.bounties).to.equal(10)
      })
    })

    describe('that is paid', () => {
      xit('should return the sum of all bounties', async () => {
        await models.Task.bulkCreate([
          { value: 10, paid: true },
          { value: 10, paid: true }
        ])

        const res = await agent
          .get('/info/all')
          .expect('Content-Type', /json/)
          .expect(200)

        expect(res.body.bounties).to.equal(20)
      })
    })
  })

  describe('that is not defined', () => {
    it('should return the sum of all bounties', async () => {
      await models.Task.bulkCreate([
        { value: null, paid: true },
        { value: 10, paid: true }
      ])

      const res = await agent
        .get('/info/all')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.bounties).to.equal(10)
    })
    xit('should return the sum of all bounties when is non valid values', async () => {
      await models.Task.bulkCreate([
        { value: null, paid: true },
        { value: 10, paid: true },
        { value: null, paid: true },
        { value: 10, paid: false }
      ])

      const res = await agent
        .get('/info/all')
        .expect('Content-Type', /json/)
        .expect(200)

      expect(res.body.bounties).to.equal(20)
    })
  })
})
