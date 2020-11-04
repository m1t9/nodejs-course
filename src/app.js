const express = require('express');
const swaggerUI = require('swagger-ui-express');
const path = require('path');
const YAML = require('yamljs');

const userRouter = require('./resources/users/user.router');
const boardRouter = require('./resources/boards/board.router');
const taskRouter = require('./resources/tasks/task.router');

// task5
const loginRouter = require('./login/login.router');
const checkToken = require('./login/checkToken');

const app = express();
const swaggerDocument = YAML.load(path.join(__dirname, '../doc/api.yaml'));

// err/log import
const morgan = require('morgan');
const winston = require('./handler/logger');
const { NOT_FOUND } = require('http-status-codes');
const createError = require('http-errors');
const errorHandler = require('./errors/errorHandler');

const cors = require('cors');
const helmet = require('helmet');

app.use(helmet());
app.use(cors());
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
  app.use('/doc', swaggerUI.serve, swaggerUI.setup(swaggerDocument));
}

app.use('/', (req, res, next) => {
  if (req.originalUrl === '/') {
    res.send('Service is running!');
    return;
  }
  next();
});

app.use(
  morgan(
    ':method :status :url :query Body :body size :res[content-length] - :response-time ms',
    {
      stream: winston.stream
    }
  )
);

// task5
app.use('/login', loginRouter);
app.use('/', checkToken);

app.use('/users', userRouter);
app.use('/boards', boardRouter);
app.use('/boards/:boardId/tasks', taskRouter);

app.use((req, res, next) => next(createError(NOT_FOUND)));

// uncaughtException / unhandledRejection errors
// Promise.reject(Error('Oops!'));
// throw Error('Oops!')
app.use(errorHandler);

module.exports = app;
