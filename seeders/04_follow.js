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
        userId: 1,
        followingId: 2,
      },
      {
        id: 2,
        userId: 1,
        followingId: 3,
      },
      {
        id: 3,
        userId: 1,
        followingId: 4,
      },
      {
        id: 4,
        userId: 1,
        followingId: 5,
      },
      {
        id: 5,
        userId: 1,
        followingId: 6,
      },
      {
        id: 6,
        userId: 2,
        followingId: 1,
      },
      {
        id: 7,
        userId: 3,
        followingId: 1,
      },
      {
        id: 8,
        userId: 4,
        followingId: 1,
      },
      {
        id: 9,
        userId: 5,
        followingId: 1,
      },
      {
        id: 10,
        userId: 6,
        followingId: 2,
      },
      {
        id: 11,
        userId: 2,
        followingId: 6,
      },
      {
        id: 12,
        userId: 3,
        followingId: 6,
      },
      {
        id: 13,
        userId: 6,
        followingId: 3,
      },
    ];

    await queryInterface.bulkInsert("follow", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */

    await queryInterface.bulkDelete("follow", null, {});
  },
};
