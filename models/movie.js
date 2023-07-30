const mongoose = require('mongoose');

const { Schema } = mongoose;
const { ObjectId } = Schema;

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    director: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    duration: {
      type: Number,
      required: true,
      minlength: 2,
      maxlength: 255,
    },
    year: {
      type: String,
      required: true,
      minlength: 4,
      maxlength: 4,
    },
    description: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 32000,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i.test(v);
        },
        message: (props) => `${props.value} is not a valid url`,
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i.test(v);
        },
        message: (props) => `${props.value} is not a valid url`,
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return /^(https?:\/\/)(www\.)?[a-z0-9-._~:/?#[\]@!$&()*+,;=]{1,256}\.[a-z]{2,6}\b([a-z0-9-._~:/?#[\]@!$&()*+,;=]*)/i.test(v);
        },
        message: (props) => `${props.value} is not a valid url`,
      },
    },
    owner: {
      type: ObjectId,
      ref: 'user',
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 500,
    },
    nameEN: {
      type: String,
      required: true,
      minlength: 2,
      maxlength: 500,
    },
    movieId: {
      type: Number,
      required: true,
    },
  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
