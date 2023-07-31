const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getMovies, createMovie, delMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post(
  '/',
  celebrate({
    body: Joi.object().keys({
      country: Joi.string().required().min(2).max(255),
      director: Joi.string().required().min(2).max(255),
      duration: Joi.number().required(),
      year: Joi.string().required().min(4).max(4),
      description: Joi.string().required().min(2).max(32000),
      image: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i),
      trailerLink: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i),
      thumbnail: Joi.string().required().pattern(/^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i),
      nameRU: Joi.string().required().min(2).max(500),
      nameEN: Joi.string().required().min(2).max(500),
      movieId: Joi.number().required(),
    }),
  }),
  createMovie,
);

router.delete(
  '/:_id',
  celebrate({
    params: Joi.object().keys({
      _id: Joi.string().hex().required().length(24),
    }),
  }),
  delMovie,
);

module.exports = router;
