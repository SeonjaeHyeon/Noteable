const user = require("./01_user");
const memo = require("./02_memo");
const todo = require("./03_todo");
const follow = require("./04_follow");
const party = require("./05_party");

module.exports = async (queryInterface) => {
  const seeds = [user, memo, todo, follow, party];

  for (const seed of seeds) {
    await seed.up(queryInterface);
  }
};
