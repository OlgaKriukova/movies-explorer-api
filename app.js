// eslint-disable-next-line import/no-extraneous-dependencies
require('dotenv').config();
const express = require('express');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const { celebrate, errors, Joi } = require('celebrate');
const errorHandler = require('./middlewares/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const errorMessageNotFound = 'resource not found';

const {
  PORT = 3000,
  MONGO_URL = 'mongodb://127.0.0.1:27017',
} = process.env;

const userRoutes = require('./routes/users');
const movieRoutes = require('./routes/movies');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const allowedCors = [
  'https://diplomaok.nomoredomains.xyz',
  'http://diplomaok.nomoredomains.xyz',
  'localhost:3000',
  'http://localhost:3000',
];

const app = express();

// eslint-disable-next-line consistent-return
app.use((req, res, next) => {
  const { origin } = req.headers;

  const { method } = req;
  const DEFAULT_ALLOWED_METHODS = 'GET,HEAD,PUT,PATCH,POST,DELETE';

  const requestHeaders = req.headers['access-control-request-headers'];

  if (allowedCors.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin);
    res.header('Access-Control-Allow-Credentials', 'true');
  }

  if (method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', DEFAULT_ALLOWED_METHODS);
    res.header('Access-Control-Allow-Headers', requestHeaders);
    return res.end();
  }

  next();
});

app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

mongoose.connect(`${MONGO_URL}/bitfilmsdb`, {
  useNewUrlParser: true,
})
  .then(() => {
    // eslint-disable-next-line no-console
    console.log('connected to db');
  });

app.use(requestLogger);

app.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login,
);

app.post(
  '/signup',
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser,
);

app.use(auth);

app.use('/users', userRoutes);
app.use('/movies', movieRoutes);

app.use((req, res, next) => next(new NotFoundError(errorMessageNotFound)));

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
