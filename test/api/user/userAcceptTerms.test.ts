import request from 'supertest'
import { expect } from 'chai'
import api from '../../../src/server'
import Models from '../../../src/models'
import { truncateModels } from '../../helpers'
import { userBuilds } from '../../../src/modules/users'
// @ts-ignore - jsonwebtoken has no type definitions
import jwt from 'jsonwebtoken'

const models = Models as any
const agent = request.agent(api)

const makeToken = (payload: object) => jwt.sign(payload, process.env.SECRET_PHRASE as string)

describe('Terms of Service acceptance', () => {
  beforeEach(async () => {
    await truncateModels(models.User)
  })

  describe('userBuilds', () => {
    it('leaves terms_accepted_at unset for a new GitHub signup', async () => {
      const user: any = await userBuilds({
        provider: 'github',
        provider_id: '12345',
        email: 'githubuser@example.com',
        name: 'GitHub User',
        username: 'githubuser'
      })

      expect(user).to.exist
      expect(user.terms_accepted_at).to.not.exist
      expect(user.email_verified).to.equal(true)
    })

    it('stamps terms_accepted_at immediately for a local signup', async () => {
      const user: any = await userBuilds({
        email: 'localuser@example.com',
        password: 'password123',
        confirmPassword: 'password123'
      })

      expect(user).to.exist
      expect(user.terms_accepted_at).to.exist
    })
  })

  describe('POST /auth/accept-terms', () => {
    it('sets terms_accepted_at for the authenticated user', async () => {
      const user: any = await userBuilds({
        provider: 'github',
        provider_id: '54321',
        email: 'pendingterms@example.com',
        name: 'Pending Terms',
        username: 'pendingterms'
      })

      const token = makeToken({ id: user.id, email: user.email })

      const res = await agent
        .post('/auth/accept-terms')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)

      expect(res.body.terms_accepted_at).to.exist

      const updatedUser = await models.User.findByPk(user.id)
      expect(updatedUser.terms_accepted_at).to.exist
    })

    it('rejects requests without a valid token', async () => {
      await agent.post('/auth/accept-terms').expect(403)
    })

    it('updates the Types when Types ids are provided', async () => {
      const user: any = await userBuilds({
        provider: 'github',
        provider_id: '11111',
        email: 'typedterms@example.com',
        name: 'Typed Terms',
        username: 'typedterms'
      })

      const types = await models.Type.findAll({ limit: 2 })
      const typeIds = types.map((type: any) => type.id)

      const token = makeToken({ id: user.id, email: user.email })

      await agent
        .post('/auth/accept-terms')
        .set('Authorization', `Bearer ${token}`)
        .send({ Types: typeIds })
        .expect(200)

      const updatedUser = await models.User.findByPk(user.id, { include: [models.Type] })
      const updatedTypeIds = updatedUser.Types.map((type: any) => type.id).sort()
      expect(updatedTypeIds).to.deep.equal([...typeIds].sort())
    })

    it('updates the name when a name is provided', async () => {
      const user: any = await userBuilds({
        provider: 'github',
        provider_id: '22222',
        email: 'namedterms@example.com',
        name: 'Original Name',
        username: 'namedterms'
      })

      const token = makeToken({ id: user.id, email: user.email })

      const res = await agent
        .post('/auth/accept-terms')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Corrected Name' })
        .expect(200)

      expect(res.body.name).to.equal('Corrected Name')

      const updatedUser = await models.User.findByPk(user.id)
      expect(updatedUser.name).to.equal('Corrected Name')
    })
  })
})
