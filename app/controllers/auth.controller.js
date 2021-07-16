const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
app.use(express.static(__dirname + '/public'));
const db = require("../models");
const config = require("../config/auth.config");
const User = db.user;
const Role = db.role;

app.use(cookieParser());
const Op = db.Sequelize.Op;

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");

// end signup
exports.signup = (req, res) => {
  // Save User to Database
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 8)
  })
    .then(user => {
      if (req.body.roles) {
        Role.findAll({
          where: {
            name: {
              [Op.or]: req.body.roles
            }
          }
        }).then(roles => {
          user.setRoles(roles).then(() => {
            res.send({ message: "User registered successfully!" });
          });
        });
      } else {
        // user role = 1
        user.setRoles([1]).then(() => {
          res.send({ message: "User registered successfully!" });
        });
      }
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });
};// end signup

exports.signin = (req, res) => {
  //let username = req.body.username;
  //let password = req.body.password;
  User.findOne({
    where: {
      username: req.body.username
    }
  })
    .then(user => {
      if (!user) {
        return res.status(404).send({ message: "User Not found." });
      }

      var passwordIsValid = bcrypt.compareSync(
        req.body.password,
        user.password
      );

      if (!passwordIsValid) {
        return res.status(401).send({
          accessToken: null,
          message: "Invalid Password!"
        });
      }

      //generate token to be sent out to requestor
      var token = jwt.sign({ id: user.id }, config.secret, {
        expiresIn: 86400 // 24 hours
      });
      
      var authorities = [];
      user.getRoles().then(roles => {
        for (let i = 0; i < roles.length; i++) {
          authorities.push("ROLE_" + roles[i].name.toUpperCase());
        }
        //res.cookie('x-access-token', token);
        //res.setHeader('x-access-token', token); //pass token in header
        // obj send to DOM
        //res.redirect('/cubatrytest');
        //res.header('x-access-token', token); 
        res.cookie('x-access-token', token, { expires: new Date(Date.now() + 900000), httpOnly: true });    // You can look up the options at the API reference
        //res.header('Authorization', auth);
        res.status(200).send({
          id: user.id,
          username: user.username,
          email: user.email,
          roles: authorities,
          accessToken: token
        });
        console.log(res._headers);
      });
        
    })
    .catch(err => {
      res.status(500).send({ message: err.message });
    });

};

exports.request_token = (req, res) => {
  // .. do something lepas tu invoke request_token di routes
};
