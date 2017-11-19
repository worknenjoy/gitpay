'use strict'

const assert = require('assert')
const request = require('request')
const expect = require('chai').expect
const loading = require('../loading/loading');

describe('authenticate', () => {
    it('should authenticate sequelize', (done) => {
        loading.sequelize
            .authenticate()
            .then((err) => {
                if (err) done(err)
                else done()

            })
            .catch((err) => {
                done(err)
            });
    })
})