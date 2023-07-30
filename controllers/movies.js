const Movie = require('../models/movie');

const NotFoundError = require('../errors/NotFoundError');
const WrongDataError = require('../errors/WrongDataError');
const ForbiddenError = require('../errors/ForbiddenError');

const getMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id }).sort({ createdAt: -1 })
    .populate('owner')
    .then((Movies) => res.status(200).send(Movies))
    .catch(next);
};

const createMovie = (req, res, next) => {
  req.body.owner = req.user._id;
  Movie.create(req.body)
    .then((newMovie) => newMovie.populate('owner')
      .then((newMoviePopulated) => res.status(201).send(newMoviePopulated)))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new WrongDataError());
      } else {
        next(err);
      }
    });
};

const delMovie = (req, res, next) => {
  Movie.findById(req.params._id)
    .orFail(new NotFoundError())
    .then((movie) => {
      // eslint-disable-next-line eqeqeq
      if (movie.owner._id != req.user._id) {
        throw new ForbiddenError();
      }
      return movie.deleteOne()
        .then((deletedMovie) => res.status(200).send(deletedMovie));
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new WrongDataError());
      } else {
        next(err);
      }
    });
};

module.exports = {
  getMovies,
  createMovie,
  delMovie,
};
