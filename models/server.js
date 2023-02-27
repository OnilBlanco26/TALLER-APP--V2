const { rateLimit } = require('express-rate-limit');
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { db } = require('../database/db');
const { userRouter } = require('../routes/users.routes');
const { repairsRouter } = require('../routes/repairs.routes');
const initModel = require('./initModels');
const globalErrorHandler = require('../controllers/error.controller');
const AppError = require('../utils/appError');
const { default: helmet } = require('helmet');
const hpp = require('hpp');
const xss = require('xss-clean');

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 3000;
    this.limiter = rateLimit({
      max: 100,
      windowMS: 15 * 60 * 1000,
      message: 'Too many request from this IP, please try again in 15 minutes',
    });

    this.paths = {
      user: '/api/v2/user',
      repairs: '/api/v2/repairs',
    };

    this.database();
    this.middlewares();
    this.routes();
  }

  middlewares() {
    this.app.use(helmet());
    this.app.use(xss());
    this.app.use(hpp());

    if (process.env.NODE_ENV === 'development') {
      this.app.use(morgan('dev'));
    }

    // Este código se utiliza para limitar el número de llamadas API realizadas al servidor a 100 por hora.
    this.app.use('/api/v2', this.limiter);

    //UTILIZAMOS LAS CORS PARA PERMITIR ACCESO A LA API DESDE EL FRONT-END
    this.app.use(cors());
    //UTLIIZAMOS EXPRESS.JSON PARA PARSEAR EL BODY DE LA REQUEST
    this.app.use(express.json());
  }

  routes() {
    this.app.use(this.paths.user, userRouter);
    this.app.use(this.paths.repairs, repairsRouter);

    this.app.all('*', (req, res, next) => {
      return next(
        new AppError(`Can't FIND ${req.originalUrl} on this server!`, 404)
      );
    });

    this.app.use(globalErrorHandler);
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
