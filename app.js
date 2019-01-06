const express = require('express');
const port = process.env.PORT || 3000;
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const passportSteup = require('./config/passport');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
const keys = require('./keys/index');
var {
    User
} = require('./models/User');
var {
    Room
} = require('./server/class/Room');
//routes
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/auth');

const app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
//DB setup
var {
    mongoose
} = require('./config/db');
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
//------------------------------middleware section ---------------
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static('public'));
var SessionMiddleware = session({
    secret: keys.session.secret,
    resave: false,
    saveUninitialized: true,
    store: new MongoStore({
        mongooseConnection: mongoose.connection
    })
});
app.use(SessionMiddleware);
app.use(passport.initialize());
app.use(passport.session());




app.use('/', indexRouter);
app.use('/auth', usersRouter);


//-------------------------- socket.io--------------------------

var Room = new Room();
io.use(function(socket, next) {
    SessionMiddleware(socket.request, {}, next);
});


io.on('connection', function(socket) {
    var userid = socket.request.session.passport.user;
    io.emit('newRoom', Room.getRoomsList());

    User.findById(userid, (err, doc) => {
        if (err) {
            throw err
        }
        if (doc) {
            console.log(doc.username + ' has connected');

            //-----------------------create room event----
            socket.on('createRoom', (msg, callback) => {
                var ro = Room.addRoom(msg.name, doc.username, doc._id);
                if (ro) {
                    console.log(Room.getRoomsList());
                    io.emit('newRoom', Room.getRoomsList());
                    callback();
                }

            });









            socket.on('disconnect', function() {
                console.log(doc.username + ' disconnected');
            });


        }
    });
});


http.listen(port, () => console.log(` app on port ${port}!`));