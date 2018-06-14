const util = require('util');
const User = require('../model/user');
const createError = require('http-errors');
const jwt = require('jsonwebtoken');
const config = require('config');
const _ = require('lodash');
const path = require('path');
const fs = require('fs');

function Group() {

}

Group.prototype.create = function (req, res, next) {
  var body = req.body;
  
}

module.exports = Group;
