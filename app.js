var express = require("express");
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var config = require('./config/');


var mongoose = require('mongoose');
mongoose.connect(config.database, function(err){
  if (err) {
    console.log("Error connecting to MongoDB");
    process.exit(1);
  }else{
      console.log("Data base connected");
  }
});

var db = mongoose.connection;


var routes = require('./routes/');
var events = require('./routes/events');
var search = require('./routes/search');


// Initialize app
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout: 'layout'}));
app.set('view engine', 'handlebars');

// BodyParser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());

// set static folder
app.use(express.static(path.join(__dirname, 'public')));

// express session
app.use(session({
    secret: 'shhhhh',
    saveUnititialized: true,
    resave: true
}));


// express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.');
        var root = namespace.shift();
        var formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }

        return {
            param: formParam,
            msg: msg,
            value: value
        }
    }
}));

// connect flash middleware
app.use(flash());

// global vars
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// enable CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
  
app.use('/', routes);
app.use('/events', events);
app.use('/search', search);
app.use('/edit', search);
app.use('/update', search);
app.use('/delete', search);
app.use('/custom', search);


// Make our db accessible to router
app.use(function(req,res,next){
    req.db = db;
    next();
});
app.set('port', config.port);

app.listen(app.get('port'), function() {
    console.log('Server started on port ' + app.get('port'));
}) 
