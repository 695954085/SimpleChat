const path = require('path')
const app = require('../index')
const assert = require('assert')
const server = app.listen()
const request = require('supertest').agent(server)
const db = require('../model/db')
const User = require('../model/user')

describe('Admin', function () {
  after(function () {
    // 删除测试注册的user
    User.findOne({ username: 'xia11' }, function (err, res) {
      res.remove(function () {
        db.close()
        server.close()
      })
    })
  })

  let token

  describe('#POST /v1/user', function () {
    it('创建一个用户', function (done) {
      request.post('/v1/user').set({
        'ContentType': 'Application/x-www-form-urlencoded'
      }).send('username=xia11&password=123123').expect(200).end(function (err, res) {
        if (err) {
          return done(err)
        }
        done()
      })
    })
  })

  describe('#POST /v1/login', function () {
    it('respond with json', function (done) {
      request.post('/v1/login').set({
        'ContentType': 'Application/x-www-form-urlencoded'
      }).send('username=xia11&password=123123').expect(200).end(function (err, res) {
        if (err) {
          return done(err)
        }
        assert.equal(res.body.username, 'xia11')
        token = res.body.token
        done()
      })
    })
  })

  describe('#GET /v1/user', function () {
    it('测试获取user数据', function (done) {
      request.get('/v1/user').set({
        Authorization: 'bearer ' + token
      }).expect(200).end(function (err, res) {
        if (err) {
          return done(err)
        }
        done()
      })
    })
  })
})