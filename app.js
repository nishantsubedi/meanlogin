const express = require('express');
const path = require('path');
const bodyParser= require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config= require('./config/database');

mongoose.connect(config.database, { useNewUrlParser: true });

mongoose.connection.on('connected', () => {
    console.log('Connected to database' + config.database);
});

mongoose.connection.on('error', (err) => {
    console.log('Database error' + err);
});

const app = express();

const users = require('./routes/users');

const port = process.env.PORT || 3000;

app.use(cors());

app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());

require('./config/passport')(passport);

app.use('/users', users);

app.listen(port, () => {
    console.log('server started on port '+ port);
});