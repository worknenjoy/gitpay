// test/ping.test.js
const supertest = require('supertest')
const express = require('express')
const app = express()

app.get('/ping', (req, res) => {
  res.status(200).json({ pong: true })
})

describe('Ping Test', () => {
  it('should respond to /ping', (done) => {
    supertest(app)
      .get('/ping')
      .expect(200)
      .end((err, res) => {
        if (err) return done(err)
        console.log(res.body) // deve ser { pong: true }
        done()
      })
  })
})
