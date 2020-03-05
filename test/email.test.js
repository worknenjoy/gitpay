const expect = require('chai').expect
const api = require('../server')
const TaskMail = require('../modules/mail/task')
const request = require('supertest')
const nock = require('nock')
const models = require('../models')
const { register } = require('./helpers')
const agent = request.agent(api)

xdescribe('Task mail', () => {
  nock('https://api.sendgrid.com')
  .persist()
  .post('/v3/mail/send')
  .reply(202, [{
      statusCode: 202
  }]);
  beforeEach(() => {
    models.User.destroy({where: {}, truncate: true, cascade: true}).then(function(rowDeleted){ // rowDeleted will return number of rows deleted
      if(rowDeleted === 1){
        console.log('Deleted successfully');
      }
    }, function(err){
      console.log(err);
    });
    nock.cleanAll()

  })
  it('should mail with a template to the author', (done) => {
    TaskMail.send({
      email: 'foo@example.com'
    },
    {
      foo: 'foo@example.com'
    }).then(response => {
      expect(response[0][0].statusCode).to.equal(202)
      expect(response[0][0].request.body).to.equal('{"from":{"email":"tarefas@gitpay.me"},"subject":"You created a new task on Gitpay","personalizations":[{"to":[{"email":"foo@example.com"}],"bcc":[{"email":"notifications@gitpay.me"}],"dynamic_template_data":{"foo":"foo@example.com","content":{"title":"You just created a new task on Gitpay","subject":"You created a new task on Gitpay","provider_action":"See full details on Github","call_to_action":"See your task on Gitpay","instructions":"<p>What you need to do now?</p><ul><li>Add a bounty and set the deadline if you want</li><li>You will receive offers from our contributors</li><li>Click \\"Choose\\" on Interested section</li><li>Send the necessary details to the assigned user</li><li>He will send a Pull Request for you</li><li>Approve and send bounty</li><li>The contributor will receive your bounty</li></ul>","docs":"We have this documentation to help you (in Portuguese for now)","reason":"You received this message because you subscribed to <a href=\\"http://gitpay.me\\" target=\\"_blank\\">Gitpay</a>"}}}],"asm":{"group_id":8241},"template_id":"d-6382a786b0e342fa97122faa039a7301"}')
      done()
    }).catch((e) => {
      done(new Error(e))
    })
  })
  it('should mail all the users on the platform excluding the author', (done) => {
    register(agent, {email: 'owner@mail.com', password: 'foo'}).then(res => {
      register(agent, {email: 'user1@mail.com', password: 'foo'}).then(anotherResp => {
        register(agent, {email: 'user2@mail.com', password: 'foo'}).then(thirdResp => {
          TaskMail.notify({
            email: 'owner@mail.com'
          },[{
            foo: 'bar'
          }]).then(mail => {
            expect(mail[0][0].statusCode).to.equal(202)
            expect(mail[0][0].request.body).to.equal('{"from":{"email":"tarefas@gitpay.me"},"subject":"We have a new task for you on Gitpay","personalizations":[{"to":[{"email":"user1@mail.com"}],"dynamic_template_data":{"0":{"foo":"bar"},"content":{"title":"We have a new task for you on Gitpay","provider_action":"See full details on Github","call_to_action":"Checkout the task on Gitpay","instructions":"<p>How to start to work on this project?</p><ul><li>Access the task on Gitpay</li><li>Click \\"I\'m interested\\"</li><li>Access the project repo and create a fork</li><li>Send a Pull Request</li><li>The maintaners will review, then you will receive a proper feedback and you will make the necessary adjustments to fit with the project guidelines</li><li>Then you will be rewarded<br></li></ul>","docs":"We have this documentation to help you (in Portuguese for now)","reason":"You received this message because you subscribed to <a href=\\"http://gitpay.me\\" target=\\"_blank\\">Gitpay</a>","subject":"We have a new task for you on Gitpay"}}}],"asm":{"group_id":8241},"template_id":"d-6382a786b0e342fa97122faa039a7301"}')
            //expect(mail[1][0].request.body).to.equal('{"from":{"email":"tarefas@gitpay.me"},"subject":"We have a new task for you on Gitpay","personalizations":[{"to":[{"email":"user2@mail.com"}],"dynamic_template_data":{"0":{"foo":"bar"},"content":{"title":"We have a new task for you on Gitpay","provider_action":"See full details on Github","call_to_action":"I\'m interested","instructions":"<p>How to start to work on this project?</p><ul><li>Access the task on Gitpay</li><li>Click \\"I\'m interested\\"</li><li>Access the project repo and create a fork</li><li>Send a Pull Request</li><li>The maintaners will review, then you will receive a proper feedback and you will make the necessary adjustments to fit with the project guidelines</li><li>Then you will be rewarded<br></li></ul>","docs":"We have this documentation to help you (in Portuguese for now)","reason":"You received this message because you subscribed to <a href=\\"http://gitpay.me\\" target=\\"_blank\\">Gitpay</a>","subject":"We have a new task for you on Gitpay"}}}],"asm":{"group_id":8241},"template_id":"d-6382a786b0e342fa97122faa039a7301"}')
            done()
        }).catch((e) => {
          console.log('error on test', e)
          done(new Error(e))
        })
        }).catch((e) => {
          console.log('error on test', e)
          done(new Error(e))
        })
      }).catch((e) => {
        console.log('error on test', e)
        done(new Error(e))
      })
    }).catch((e) => {
      console.log('error on test', e)
      done(new Error(e))
    })
  })
  it('should mail all user for weekly bounties', (done) => {
    register(agent, {email: 'owner@mail.com', password: 'foo'}).then(res => {
      register(agent, {email: 'user1@mail.com', password: 'foo'}).then(anotherResp => {
        register(agent, {email: 'user2@mail.com', password: 'foo'}).then(thirdResp => {
          TaskMail.weeklyBounties({tasks:[{
            id: 1,
            url: "foo",
            value: "20"
          }]}).then(mail => {
            expect(mail[0][0].statusCode).to.equal(202)
            expect(mail[0][0].request.body).to.equal('{"from":{"email":"tarefas@gitpay.me"},"subject":"We have issues with bounties on Gitpay","personalizations":[{"to":[{"email":"owner@mail.com"}],"dynamic_template_data":{"tasks":[{"url":"http://localhost:8082/#/task/1","value":"20"}],"content":{"title":"There\'s still open issues with bounties on Gitpay for you to solve","provider_action":"If want to contribute with open source, check our issues on Gitpay","call_to_action":"See the issue on Gitpay and apply to solve it","instructions":"<p>How to start to work on this project?</p><ul><li>Access the task on Gitpay</li><li>Click \\"I\'m interested\\"</li><li>Access the project repo and create a fork</li><li>Send a Pull Request</li><li>The maintaners will review, then you will receive a proper feedback and you will make the necessary adjustments to fit with the project guidelines</li><li>Then you will be rewarded<br></li></ul>","docs":"We have this documentation to help you (in Portuguese for now)","reason":"You received this message because you subscribed to <a href=\\"http://gitpay.me\\" target=\\"_blank\\">Gitpay</a>","subject":"We have issues with bounties on Gitpay"}}}],"asm":{"group_id":11285},"template_id":"d-b78b1c49a4f64c6c997948b665ae5763"}')
            done()
        }).catch((e) => {
          console.log('error on test', e)
          done(new Error(e))
        })
        }).catch((e) => {
          console.log('error on test', e)
          done(new Error(e))
        })
      }).catch((e) => {
        console.log('error on test', e)
        done(new Error(e))
      })
    }).catch((e) => {
      console.log('error on test', e)
      done(new Error(e))
    })
  })

  it('should mail all user for weekly latest issues', (done) => {
    register(agent, {email: 'owner@mail.com', password: 'foo'}).then(res => {
      register(agent, {email: 'user1@mail.com', password: 'foo'}).then(anotherResp => {
        register(agent, {email: 'user2@mail.com', password: 'foo'}).then(thirdResp => {
          TaskMail.weeklyLatest({tasks:[{
            id: 1,
            url: "foo",
            value: "20"
          }]}).then(mail => {
            expect(mail[0][0].statusCode).to.equal(202)
            expect(mail[0][0].request.body).to.equal('{"from":{"email":"tarefas@gitpay.me"},"subject":"We have open issues for you on Gitpay","personalizations":[{"to":[{"email":"owner@mail.com"}],"dynamic_template_data":{"tasks":[{"url":"http://localhost:8082/#/task/1","value":"$20"}],"content":{"title":"There\'s open issues that needs to be solved on Gitpay. You can show your interest, make an offer or contribute to improve your experience and try new challenges","provider_action":"If want to contribute with open source, check our issues on Gitpay","call_to_action":"See the issue on Gitpay and apply to solve it","instructions":"<p>How to start to work on this project?</p><ul><li>Access the task on Gitpay</li><li>Click \\"I\'m interested\\"</li><li>Access the project repo and create a fork</li><li>Send a Pull Request</li><li>The maintaners will review, then you will receive a proper feedback and you will make the necessary adjustments to fit with the project guidelines</li><li>Then you will be rewarded<br></li></ul>","docs":"We have this documentation to help you (in Portuguese for now)","reason":"You received this message because you subscribed to <a href=\\"http://gitpay.me\\" target=\\"_blank\\">Gitpay</a>","subject":"We have open issues for you on Gitpay"}}}],"asm":{"group_id":11286},"template_id":"d-0decb18add7a4b5f8d501f7e0a630777"}')
            done()
        }).catch((e) => {
          console.log('error on test', e)
          done(new Error(e))
        })
        }).catch((e) => {
          console.log('error on test', e)
          done(new Error(e))
        })
      }).catch((e) => {
        console.log('error on test', e)
        done(new Error(e))
      })
    }).catch((e) => {
      console.log('error on test', e)
      done(new Error(e))
    })
  })

})