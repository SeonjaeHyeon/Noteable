"use strict";

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

    const bulk = [
      {
        id: 1,
        content: "고급웹 강의 듣기",
        type: 0,
        userId: 1,
        createdAt: new Date("2022/06/10 13:20:15"),
      },
      {
        id: 2,
        content: "NodeJS 공부하기",
        type: 1,
        userId: 1,
        createdAt: new Date("2022/05/01"),
      },
      {
        id: 3,
        content: "DB 팀프로젝트",
        type: 2,
        userId: 1,
        createdAt: new Date("2022/04/31"),
      },
      {
        id: 4,
        content: "전공 도서 반납하기",
        type: 0,
        userId: 1,
        createdAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("todo", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("todo", null, {});
  },
};
