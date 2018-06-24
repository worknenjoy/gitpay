const loading = require('../loading/loading')

describe('authenticate', () => {
  it('should authenticate sequelize', (done) => {
    loading.sequelize
      .authenticate()
      .then(err => {
        if (err) done(err)
        else done()
      })
      .catch(err => {
        done(err)
      })
  })
})
