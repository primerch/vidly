const winston = require('winston');
require('winston-mongodb');

module.exports = function () {
  winston.add(new winston.transports.File({ filename: 'logfile.log' }));
  winston.add(
    new winston.transports.MongoDB({
      db: 'mongodb://localhost/vidly',
      level: 'error',
    })
  );

  winston.exceptions.handle(
    // logs uncaught exceptions
    new winston.transports.File({ filename: 'exceptions.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(), // adds colors to console output
        winston.format.simple() // human-readable format
      ),
    })
  );

  winston.rejections.handle(
    // logs unhandled promise rejections
    new winston.transports.File({ filename: 'rejections.log' }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    })
  );
};
