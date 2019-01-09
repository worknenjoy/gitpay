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
    {
      foo: 'foo@example.com'
    }).then(response => {
      expect(response[0].request.body).to.equal('{"from":{"email":"tarefas@gitpay.me"},"subject":"You created a new task on Gitpay","personalizations":[{"to":[{"email":"foo@example.com"}],"dynamic_template_data":{"foo":"foo@example.com","content":{"title":"You just created a new task on Gitpay","provider_action":"See full details on Github","call_to_action":"See your task on Gitpay","instructions":"<p>What you need to do now?</p><ul><li>Add a bounty and set the deadline if you want</li><li>You will receive offers from our contributors</li><li>Click \\"Choose\\" on Interested section</li><li>Send the necessary details to the assigned user</li><li>He will send a Pull Request for you</li><li>Approve and send bounty</li><li>The contributor will receive your bounty</li></ul>","docs":"We have this documentation to help you (in Portuguese for now)","reason":"You received this message because you subscribed to <a href=\\"http://gitpay.me\\" target=\\"_blank\\">Gitpay</a>"}}}],"asm":{"group_id":8241},"template_id":"d-6382a786b0e342fa97122faa039a7301"}')
      expect(response[0].statusCode).to.equal(202)
      done()
    }).catch((e) => {
      done(new Error(e))
    })
  })
})
