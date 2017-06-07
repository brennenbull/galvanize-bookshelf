'use strict';

const express = require('express');
const humps = require('humps');
const knex = require('../knex');
const cookieParser = require('cookie-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 8;
function hash(plaintext) {
  return bcrypt.hashSync(plaintext,8);
}


// eslint-disable-next-line new-cap
const router = express.Router();
router.use(cookieParser());

router.get('/token', (req, res, next)=>{
  let token = req.cookies.token;
  jwt.verify(token, 'secret', (err, decoded)=>{
    if(err){
      return res.send(false);
    }
    res.send(true);
  });
});

router.post('/token', (req, res, next)=>{
  let email = req.body.email;
  let plainpass = req.body.password;
  knex('users').where('email', email).then((result)=>{
    if(result[0] === undefined){
      res.setHeader('content-type', 'text/plain');
      return res.status(400).send('Bad email or password');
    }
    bcrypt.compare(plainpass, result[0].hashed_password, function(err, response){
      if(response){
        let resBody = result[0];
        delete resBody.hashed_password;
        let tokenRes = resBody;
        delete tokenRes.created_at;
        delete tokenRes.updated_at;
        let token = jwt.sign(tokenRes, 'secret');
        res.cookie('token', token, {httpOnly: true});
        return res.send(humps.camelizeKeys(resBody));
      }else{
        res.setHeader('content-type', 'text/plain');
        return res.status(400).send('Bad email or password');
      }
    });
  });
});

router.delete('/token', (req, res, next)=>{
  res.cookie('token','');
  res.send(true);
});

module.exports = router;
