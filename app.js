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

var {
    Active
} = require('./server/class/Active');
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
var Active = new Active();
io.use(function(socket, next) {
    SessionMiddleware(socket.request, {}, next);
});


io.on('connection', function(socket) {


    var userid = socket.request.session.passport.user;

    User.findById(userid, (err, doc) => {
        if (err) {
            throw err
        }
        if (doc) {
            console.log(doc.username + ' has connected');

            //-----------------------create room event----

            io.emit('newRoom', Room.getRoomsList());
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


io.of('/chatroom').on('connection', function(socket) {

    //------------------------- join private room ---------------
    socket.on('join', (params, callback) => {
        console.log('user joined ' + params.room);
        if (!Room.getRoomByID(params.room)) {
            callback('this is not a real room plz choose an exist one or create a new ');
        }
        // join private room 
        socket.join(params.room);
        var userid = socket.request.session.passport.user;
        User.findById(userid, (err, doc) => {
            if (err) {
                throw err
            }
            if (doc) {
                Active.removeUser(doc._id);
                Active.addUser(doc._id, doc.username, params.room, doc.image);
                console.log(Active.getUserList(params.room));
                io.of('/chatroom').to(params.room).emit('activeUpdate', Active.getUserList(params.room));


                //--------- emit welcome message from admin to single user 
                socket.emit('newMessage', {
                    from: 'admin',
                    image: '/images/1150341_658807634221691_5719647891456350915_n.jpg',
                    body: `welcome ${doc.username} in ${params.room} room`
                });
                //------- emit alert message that a new user connected
                socket.broadcast.emit('newMessage', {
                    from: 'admin',
                    image: '/images/1150341_658807634221691_5719647891456350915_n.jpg',
                    room: params.room,
                    body: `${doc.username} has joined`
                });
                //---------------------messages 
                socket.on('newMessage', function(msg, callback) {
                    console.log(msg);
                    io.of('/chatroom').to(params.room).emit('newMessage', {
                        from: doc._id,
                        room: params.room,
                        body: msg.body,
                        image: doc.image||null,
                        name: doc.username
                    });
                    callback();
                })



            }
            callback();
        });
    });
    socket.on('disconnect', function() {
        var userid = socket.request.session.passport.user;

        var params = Active.removeUser(userid);
        //console.log(params.username + "  has disconnect from the room ")
        console.log(Active.getUserList(params.room_id));
        io.of('/chatroom').to(params.room_id).emit('activeUpdate', Active.getUserList(params.room_id));
    });
});


http.listen(port, () => console.log(` app on port ${port}!`));