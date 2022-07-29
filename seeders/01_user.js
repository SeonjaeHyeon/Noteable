"use strict";

const bcrypt = require("bcrypt");
const salt = 12;

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */

    const hash = bcrypt.hashSync("1234", salt);

    const bulk = [
      {
        id: 1,
        authId: "hsj106",
        authPw: hash,
        name: "현선재",
        email: "hsj106@naver.com",
      },
      {
        id: 2,
        authId: "hmin55",
        authPw: hash,
        name: "김형민",
        email: "hmin@gmail.com",
      },
      {
        id: 3,
        authId: "junseo888",
        authPw: hash,
        name: "박준서",
        email: "jun@naver.com",
      },
      {
        id: 4,
        authId: "jina1",
        authPw: hash,
        name: "남지나",
        email: "jina@daum.net",
      },
      {
        id: 5,
        authId: "jun001",
        authPw: hash,
        name: "현준영",
        email: "jun12@gmail.com",
      },
      {
        id: 6,
        authId: "yeseo16",
        authPw: hash,
        name: "김예서",
        email: "yes@gmail.com",
      },
    ];

    await queryInterface.bulkInsert("user", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("user", null, {});
  },
};
