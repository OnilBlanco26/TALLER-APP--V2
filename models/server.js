const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { db } = require('../database/db');
const { userRouter } = require('../routes/users.routes');
const { repairsRouter } = require('../routes/repairs.routes');
const initModel = require('./initModels');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;

    this.paths = {
      user: '/api/v2/user',
      repairs: '/api/v2/repairs',
    };

    this.database();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    //UTILIZAMOS LAS CORS PARA PERMITIR ACCESO A LA API DESDE EL FRONT-END
    this.app.use(cors());
    //UTLIIZAMOS EXPRESS.JSON PARA PARSEAR EL BODY DE LA REQUEST
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.user, userRouter);
    this.app.use(this.paths.repairs, repairsRouter);
  }

  database() {
    db.authenticate()
      .then(() => console.log('Database authenticate'))
      .catch(err => console.log(err));

    initModel();

    db.sync()
      .then(() => console.log('Database Synced'))
      .catch(err => console.log(err));
  }

  listen() {
    this.app.listen(this.port, () => {
      console.log('Server running on port', this.port);
    });
  }
}

module.exports = Server;
