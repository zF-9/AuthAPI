const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');
const cors = require("cors");
//var io = require('socket.io');
//var socketioJwt = require('socketio-jwt');
//require('dotenv').config({path: '../laravel/.env'});*/
var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
//const config = require("../config/auth.config");


//const Op = db.Sequelize.Op;


const app = express();
app.use(cookieParser());
app.use(express.static(__dirname + '/public'));

var corsOptions = {
  origin: "http://localhost:8081"
};

//app.use(express.static(__dirname + '/public'));

app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// database
const db = require("./app/models");
const { JsonWebTokenError } = require("jsonwebtoken");
const Role = db.role;

db.sequelize.sync();
// force: true will drop the table if it already exists
// db.sequelize.sync({force: true}).then(() => {
//   console.log('Drop and Resync Database with { force: true }');
//   initial();
// });

//enable Cross-Origin-Resource-Sharing
app.use(cors({
  credentials: true,
  exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar', 'x-access-token', 'Authorization'],
}));

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Auth-Proto application." });
});

// Another simple route: for testing
app.get("/cubatrytest", (req, res) => {
  //let token = req.headers["x-access-token"];
  const token = req.cookies["x-access-token"];
  //const token = (new URL(document.location)).searchParams.get('token');
  res.sendFile(__dirname + '/app/views/Home_user.html');
  console.log(token);
});



// Test route for ui/ux 
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/app/views/login.html');
});

app.post('/test_log', (req, res) => {
  var token = req.headers["x-access-token"];
  // Insert Login Code Here
  let username = req.body.username;
  let password = req.body.password;
  res.send(`Username: ${username} Password: ${password}`, token);
});

// routes
require('./app/routes/auth.routes')(app);
require('./app/routes/user.routes')(app);



app.get('/page_test', (req, res) => {
  res.sendFile(__dirname + '/app/views/container.html');
})

// set port, listen for requests
const PORT = process.env.PORT || 4848
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

// Accept connection and authorize token
/*io.on('connection', socketioJwt.authorize({
  secret: process.env.JWT_SECRET,
  timeout: 15000
}));
// When authenticated, send back name + email over socket
io.on('authenticated', function (socket) {
  console.log(socket.decoded_token);
  socket.emit('name', socket.decoded_token.name);
  socket.emit('email', socket.decoded_token.email);
});*/
const CheckToken = (req, res, next) => {
  const header = req.headers['x-access-token'];
    if(typeof header != 'undefined'){
      const bearer = header.split(' ');
      const token = bearer[1];
      req.token = token;
      next();
    }
    else {
      res.sendStatus(403);
    }
}

app.get('/req_token', CheckToken, (req,res) => {
  //verify over jwt 
  jwt.verify(req.token, config.secret, (err, authorizedData) => {
    if(err){
      console.log('ERROR: could not connect ot protected route');
      res.send(403);
    }
    else{
      res.json({
        message: 'Logged in',
        authorizedData
      });
      console.log('SUCCESS: connected to protected route');
    }
  })
})

function initial() {
  Role.create({
    id: 1,
    name: "user"
  });
 
  Role.create({
    id: 2,
    name: "moderator"
  });
 
  Role.create({
    id: 3,
    name: "admin"
  });
}

