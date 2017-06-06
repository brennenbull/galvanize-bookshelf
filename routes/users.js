'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const bcrypt = require('bcrypt');
const saltRounds = 8;
function hash(plaintext) {
  return bcrypt.hashSync(plaintext,8);
}

// eslint-disable-next-line new-cap
const router = express.Router();
router.post('/users', (req, res, next)=>{
  let hashpass = hash(req.body.password);
  let userData = humps.decamelizeKeys(req.body);
  userData.hashed_password = hashpass;
  delete userData.password;
  knex('users').insert(userData).returning('*').then((user)=>{
    let obj = humps.camelizeKeys(user[0]);
    delete obj.hashedPassword;
    res.send(obj);
  });
});

module.exports = router;
