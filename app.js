const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session')

const validate = require('./middleware/validate');

const index = require('./routes/index');
const member = require('./routes/member');
const horse = require('./routes/horse');
const search = require('./routes/search');

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', search.findForm);
app.post('/result', search.result);

app.get('/member', member.form);
app.get('/member/:id', member.show);
app.get('/member/edit/:id', member.formEdit);
app.post('/member/edit', member.update);
app.get('/member/delete/:id', member.delete);
app.post('/member', member.save);
app.get('/members', member.list);

app.get('/horse', horse.form);
app.post('/horse', horse.save);
app.get('/horses', horse.list);
app.get('/horse/edit/:id/:chipnr', horse.formEdit);
app.post('/horse/edit', horse.update);
app.get('/horse/delete/:chipnr', horse.delete);

// 404
app.use((req, res, next) => {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
