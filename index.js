const express = require('express')
const bodyParser = require('body-parser')
const app = express()

//requred in the db to use the middleware i made.
const db = require('./queries')
const port = 3000
const cors = require('cors')
//const passport = require('passport');
//const LocalStrategy = require('passport-local').Strategy;
const helmet = require('helmet');

// s=ecurity measures
app.use(cors());
app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


// The code below is used to enable authentication using Passport. The idea behind it is requiring authenitication before posting, putting, and deleting data. Commented out because it is not needed
// however its nice to know how to do so.

 /** app.use(passport.initialize());
passport.use(new LocalStrategy((username, password, done) => {
  db.getUserByUsername(username, (error, user) => {
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
  });
}));

app.get('/', (request, response) => {
  response.json({ info: 'Node.js, Express, and Postgres API' })
})

app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', passport.authenticate('local', { failureRedirect: '/' }), db.createUser)
app.put('/users/:id', passport.authenticate('local', { failureRedirect: '/' }), db.updateUser)
app.delete('/users/:id', passport.authenticate('local', { failureRedirect: '/' }), db.deleteUser) **/

//CRUD api using the middleware created in queries.js
app.get('/users', db.getUsers)
app.get('/users/:id', db.getUserById)
app.post('/users', db.createUser)
app.put('/users/:id', db.updateUser)
app.delete('/users/:id', db.deleteUser)

//Error handling

app.use((req, res, next ) => {
  const error = new Error('Something went wrong');
  next(error);
})
app.use((error, request, response, next) => {
  console.error('Error: ', error.message);
  response.status(500).send('Internal Server Error');
});
app.listen(port, () => {
  console.log(`App running on port ${port}.`)
})
