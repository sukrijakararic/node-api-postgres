const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const db = require('./queries')
const port = 3000
const cors = require('cors')
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');

app.use(cors());
app.use(helmet());

app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)

app.use(passport.initialize());
app.use(new LocalStrategy((username, password, done) => {
  function checkUser(error, user) {
    if (error) {
      return done(error);
    }
    if (!user) {
      return done(null, false, { message: 'Incorrect username.' });
    }
    if (!user.password || user.password !== password) {
      return done(null, false, { message: 'Incorrect password.' });
    }
    return done(null, user);
  }
  db.getUserByUsername(username, checkUser);
}))

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', passport.authenticate('local', {failureRedirect: '/'}), db.createUser)
app.put('/users/:id', passport.authenticate('local', {failureRedirect: '/'}), db.updateUser)
app.delete('/users/:id', passport.authenticate('local', {failureRedirect: '/'}), db.deleteUser)

app.use((req, res, next ) => {
  const error = new Error('Something went wrong')
  next(error)
})
app.use((error, request, response, next) => {
  console.error('Error: ', error.message)
  res.status(500).send('Internal Server Error');
})
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})