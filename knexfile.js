'use strict';

module.exports = {
  development: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_dev'
  },

  test: {
    client: 'pg',
    connection: 'postgres://localhost/bookshelf_test'
  },

  production: {
    client: 'pg',
    connection: 'postgres://rbtsoenkyjeyci:e0611d4c6cb4465d05490d739ea4fc142c8a17a8a4beb1c110b51536835585f5@ec2-107-21-99-176.compute-1.amazonaws.com:5432/d2o2gr3476pmk6'
  }
};
