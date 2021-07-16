const express = require("express");
const jwt = require("jsonwebtoken");
var cookieParser = require('cookie-parser');
const config = require("../config/auth.config.js");
const db = require("../models");
const User = db.user;
const app = express();
app.use(cookieParser());

verifyToken = (req, res, next) => {
  /*const header = req.headers['Authorization'];
  if(typeof header != 'undefined'){
    const bearer = header.split(' ');
    const token = bearer[1];
    //req.token = token;
    next();
  }
  else {
    res.status(403).send({
      message: "No Authorization provided!. header:[ " + header + " ]"
    });
  }*/
  //let token = req.headers["x-access-token"];
  const token = req.cookies["x-access-token"];
  //let token = req.cookie('x-access-token');
  //console.log(token);
  //let token_post = token.decode('UTF-8');
  //console.log(token);

  if (!token) {
    return res.status(403).send({
      message: "No token provided!. Token:[ " + token + " ]"
    });
  }

  //snippet for client side: with cookie-parser
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({
        message: "Unauthorized!"
      });
    }
    req.userId = decoded.id;
    next();
  });
  //snippet for client side: with cookie-parser
};

isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Admin Role!"
      });
      return;
    });
  });
};

isModerator = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator Role!"
      });
    });
  });
};

isModeratorOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then(user => {
    user.getRoles().then(roles => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }

        if (roles[i].name === "admin") {
          next();
          return;
        }
      }

      res.status(403).send({
        message: "Require Moderator or Admin Role!"
      });
    });
  });
};

/*checkToken = (req, res, next) => {
  const header = req.headers['Authorization'];
    if(typeof header != 'undefined'){
      const bearer = header.split(' ');
      const token = bearer[1];
      req.token = token;
      next();
    }
    else {
      res.sendStatus(403);
    }
};*/


const authJwt = {
  verifyToken: verifyToken,
  isAdmin: isAdmin,
  isModerator: isModerator,
  isModeratorOrAdmin: isModeratorOrAdmin
};
module.exports = authJwt;
