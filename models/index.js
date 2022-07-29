const Sequelize = require("sequelize");
const User = require("./User");
const Memo = require("./Memo");
const Todo = require("./Todo");
const Follow = require("./Follow");
const Party = require("./Party");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env];

const db = {};
const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.User = User;
db.Memo = Memo;
db.Todo = Todo;
db.Follow = Follow;
db.Party = Party;

User.init(sequelize);
Memo.init(sequelize);
Todo.init(sequelize);
Follow.init(sequelize);
Party.init(sequelize);

User.associate(db);
Memo.associate(db);
Todo.associate(db);
Follow.associate(db);
Party.associate(db);

module.exports = db;
