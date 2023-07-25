const express = require('express');
const mongoose = require('mongoose');
// eslint-disable-next-line import/no-extraneous-dependencies
const bodyParser = require('body-parser');
// eslint-disable-next-line import/no-extraneous-dependencies
const { errors } = require('celebrate');
const { createUsers, login } = require('./controllers/users');
const ErrorNotFound = require('./errors/ErrorNotFound');
const { validateLogin, validateCreateUser } = require('./middlewares/validate');

const { PORT = 3000 } = process.env;

const auth = require('./middlewares/auth');
const middleware = require('./middlewares/middleware');

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
mongoose.connect('mongodb://127.0.0.1:27017/mestodb');

app.post('/signup', validateCreateUser, createUsers);
app.post('/signin', validateLogin, login);
app.use('/cards', auth, require('./routes/cards'));
app.use('/users', auth, require('./routes/users'));

app.use('*', (req, res, next) => {
  next(new ErrorNotFound('Страница не найдена'));
});
app.use(errors());
app.use(middleware);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
