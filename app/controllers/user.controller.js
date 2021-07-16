const express = require("express");
const app = express();
//app.use(cookieParser());
app.use(express.static( __dirname));

exports.allAccess = (req, res) => {
  //res.header('Access-Control-Expose-Headers', 'Content-Type, Location');
  //res.send(200);

  //var token = req.headers["x-access-token"];
  //console.log(token);
  res.status(200).send("Public Content"); //index.html 
  //res.sendFile('C:/xampp/htdocs/AuthAPI/app/views/Home_user.html');
};

exports.userBoard = (req, res) => {
  //res.status(200).send("User Content.");
  res.sendFile('C:/xampp/htdocs/AuthAPI/app/views/Home_user.html');
};

exports.adminBoard = (req, res) => {
  //res.status(200).send("Admin Content.");
  //console.log(__dirname);
  res.sendFile('C:/xampp/htdocs/AuthAPI/app/views/Home_admin.html');
};

exports.moderatorBoard = (req, res) => {
  res.sendFile('C:/xampp/htdocs/AuthAPI/app/views/Home_mod.html');
  //res.status(200).send("Moderator Content.");
  //res.setHeader("Location", "https://stackoverflow.com/questions/40497534/how-to-res-send-to-a-new-url-in-node-js-express/40497649");
  //res.end();
};

exports.FetchData = (req, res) => {
  var token = req.headers["x-access-token"];
  res.status(200).send(token);
};
