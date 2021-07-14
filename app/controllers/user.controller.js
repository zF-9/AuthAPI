exports.allAccess = (req, res) => {
  res.header('Access-Control-Expose-Headers', 'Content-Type, Location');
  //res.send(200);

  var token = req.headers["x-access-token"];
  //console.log(token);
  //res.status(200).send("Public Content. token: " + token); //index.html 
};

exports.userBoard = (req, res) => {
  res.status(200).send("User Content.");
};

exports.adminBoard = (req, res) => {
  res.status(200).send("Admin Content.");
};

exports.moderatorBoard = (req, res) => {
  res.status(200).send("Moderator Content.");
  //res.setHeader("Location", "https://stackoverflow.com/questions/40497534/how-to-res-send-to-a-new-url-in-node-js-express/40497649");
  //res.end();
};

exports.FetchData = (req, res) => {
  var token = req.headers["x-access-token"];
  res.status(200).send(token);
};
