module.exports = {
  HOST: "localhost",
  USER: "test_dev",
  PASSWORD: "qwerty123wasd",
  DB: "AuthPrototype",
  dialect: "mysql",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
