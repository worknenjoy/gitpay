const expect = require('chai').expect
const TaskMail = require('../modules/mail/task')
const nock = require('nock')
const { sendgrid } = require('../config/secrets')
const sgMail = require('@sendgrid/mail')
sgMail.setApiKey(sendgrid.apiKey)

const mock_sg = nock('https://api.sendgrid.com')
  .post('/v3/mail/send')
  .reply(202, [{
      statusCode: 202
  }]);

describe('Task mail', () => {
  it('should mail with a template to one user', (done) => {
    TaskMail.send({
      email: 'foo@example.com'
    }, 
    'test subject',
    {
      foo: 'foo@example.com'
    }).then(response => {
      expect(response[0].request.body).to.equal('{"from":{"email":"tarefas@gitpay.me"},"subject":"You created a new task on Gitpay","personalizations":[{"to":[{"email":"foo@example.com"}]}],"content":[{"value":"test subject","type":"text/html"}]}')
      expect(response[0].statusCode).to.equal(202)
      done()
    }).catch((e) => {
      done(new Error(e))
    })
  })
})
