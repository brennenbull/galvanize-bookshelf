'use strict';

const express = require('express');

// eslint-disable-next-line new-cap
const router = express.Router();
const knex = require('../knex');
const humps = require('humps');

router.get('/books', (req, res, next)=>{
  knex('books').orderBy('title').then((book)=>{
    res.send(humps.camelizeKeys(book));
  });
});

router.get('/books/:id', (req, res, next)=>{
  let id = req.params.id;
  knex('books').where('id', id).then((book)=>{
    res.send(humps.camelizeKeys(book)[0]);
  });
});

router.post('/books', (req, res, next)=>{
  knex('books').insert(humps.decamelizeKeys(req.body)).returning('*').then((books)=>{
    res.send(humps.camelizeKeys(books[0]));
  });
});

router.patch('/books/:id', (req, res, next)=>{
  let id = req.params.id;
  let bookObj = req.body;
  bookObj.cover_url = bookObj.coverUrl;
  delete bookObj.coverUrl;
  knex('books').where('id', id).returning('*').update(bookObj).then((book)=>{
    res.send(humps.camelizeKeys(book[0]));
  });
});

router.delete('/books/:id', (req, res, next)=>{
  let id = req.params.id;
  knex('books').where('id', id).returning('*').del().then((book)=>{
    let bookObj = humps.camelizeKeys(book[0]);
    delete bookObj.id;
    res.send(bookObj);
  });
});

module.exports = router;
