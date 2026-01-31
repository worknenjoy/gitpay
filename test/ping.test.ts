// test/ping.test.ts
import supertest from 'supertest'
import express from 'express'

const app = express()

app.get('/ping', (req, res) => {
  res.status(200).json({ pong: true })
})

describe('Ping Test', () => {
  it('should respond to /ping', async () => {
    const res = await supertest(app)
      .get('/ping')
      .expect(200)
    
    console.log(res.body) // deve ser { pong: true }
  })
})
