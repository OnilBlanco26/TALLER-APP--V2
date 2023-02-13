const AppError = require('../utils/appError');

const handleCastError22P02 = () => {
  const message = `Some type of data is invalid`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err.status,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  //Operation, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.status,
      message: err.message,
    });
  } else {
    //Programming or other unknown error: don't leak error details
    //1) Log error
    console.error('ERROR 💥', err);
    //2) Send generic message
    res.status(500).json({
      error: 'fail',
      message: 'Something went wrong',
    });
  }
};

const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = er.statusCode || 500;
  err.status = err.status || 'fail';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  if (process.end.NODE_ENV === 'production') {
    let error = { ...err };

    if (!error.parent?.code) {
      error = err;
    }
    if (error.parent?.code === '22P02') error = handleCastError22P02(error);

    sendErrorProd(error, res);
  }
};

module.exports = globalErrorHandler;
