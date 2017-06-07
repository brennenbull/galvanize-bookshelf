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

router.use('/favorites', function(req, res, next){
  let token = req.cookies.token;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
    if(decoded){
      req.body.payload = decoded;
      return next();
    } else{
      res.setHeader('content-type', 'text/plain');
      return res.status(401).send('Unauthorized');
    }
  });
});

router.get('/favorites', (req, res, next)=>{
  let token = req.cookies.token;
  let userId;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
    userId = decoded.id;
    knex('favorites').where('user_id', userId).innerJoin('books','books.id', '=','favorites.book_id').then((result)=>{
      res.send(humps.camelizeKeys(result));
    });
  });
});

router.get('/favorites/check', (req, res, next)=>{
  let token = req.cookies.token;
  let userId;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
    let bookId = req.query.bookId;
    userId = decoded.id;
    knex('favorites').where('user_id', userId).where('book_id', bookId).then((result)=>{
      if(!result.length){
        res.send(false);
      }else{
        res.send(true);
      }
    });
  });
});

router.post('/favorites', (req, res, next)=>{
  let token = req.cookies.token;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
    let newFavObj = {};
    newFavObj.bookId = req.body.bookId;
    newFavObj.userId = decoded.id;
    knex('favorites').insert(humps.decamelizeKeys(newFavObj)).returning('*').then((result)=>{
      delete result[0].created_at;
      delete result[0].updated_at;
      res.send(humps.camelizeKeys(result[0]));
    });
  });
});

router.delete('/favorites', (req, res, next)=>{
  let token = req.cookies.token;
  jwt.verify(token, process.env.JWT_KEY, (err, decoded)=>{
    let delID = req.body.bookId;
    knex('favorites').where('book_id',delID)
    .returning('*').del().then((result)=>{
      delete result[0].created_at;
      delete result[0].updated_at;
      delete result[0].id;
      res.send(humps.camelizeKeys(result[0]));
    });
  });
});



module.exports = router;
