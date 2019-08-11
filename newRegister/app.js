const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');

const app = express();

//Passport config
require('./config/passport')(passport);

//Db config
const db = require('./config/keys').MongoURI;

//Connection à mongo
mongoose.connect(db, { useNewUrlParser: true })
    .then(() => console.log('Mongo connected...'))
    .catch(err => console.log(err));

const PORT = process.env.PORT || 5000;

//Bodyparser
app.use(express.urlencoded({ extended: false }));

//Express-session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

//Passport middware
app.use(passport.initialize());
app.use(passport.session());

//Connect flash
app.use(flash())

//Global vars
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

//Route
app.use(expressLayouts);
app.set('view engine', 'ejs');

app.use('/', require('./routes/users'));

app.listen(PORT, console.log(`server started on port ${PORT}`));