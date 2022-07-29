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
        todoId: 1,
        partyId: 2,
      },
      {
        id: 2,
        todoId: 1,
        partyId: 3,
      },
      {
        id: 3,
        todoId: 1,
        partyId: 4,
      },
      {
        id: 4,
        todoId: 3,
        partyId: 4,
      },
      {
        id: 5,
        todoId: 3,
        partyId: 5,
      },
      {
        id: 6,
        todoId: 2,
        partyId: 5,
      },
      {
        id: 7,
        todoId: 2,
        partyId: 2,
      },
    ];

    await queryInterface.bulkInsert("party", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("party", null, {});
  },
};
