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
        title: "테스트",
        content: "메모 테스트",
        img: "DSC_02021654963765704.jpg",
        userId: 1,
        createdAt: new Date("2022/06/01"),
        updatedAt: new Date("2022/06/01"),
      },
      {
        id: 2,
        title: "Lorem Ipsum",
        content:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec commodo cursus imperdiet. Fusce bibendum ipsum ac volutpat sodales. Praesent semper magna eget massa faucibus cursus. Cras vel tortor at lacus pretium tincidunt. Aliquam quis arcu est. Nulla a metus vulputate, mollis est at, hendrerit nulla. Suspendisse imperdiet elit mattis neque facilisis porttitor. Nulla sagittis purus eget ante gravida ultricies. Quisque euismod nisi malesuada venenatis interdum.",
        img: null,
        userId: 1,
        createdAt: new Date("2022/06/01"),
        updatedAt: new Date("2022/06/01"),
      },
      {
        id: 3,
        title: "한글 Lorem Ipsum",
        content:
          "갑 투명하되 그러므로 이상의 물방아 너의 피어나기 보이는 운다. 원대하고, 같지 실로 내려온 있는가? 불어 끝까지 기관과 끓는 것이다. 어디 보이는 타오르고 크고 두손을 속에 그들은 있는 것이다. 대한 넣는 두기 어디 뜨거운지라, 사막이다. 없으면, 황금시대를 천지는 풀밭에 우리 아니다. 구하기 할지라도 길을 무엇을 인생을 칼이다. 든 피고, 피부가 있는가? 얼음 위하여, 대한 날카로우나 방황하여도, 없는 별과 끓는다.",
        img: "owl1654981786063.jpg",
        userId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    await queryInterface.bulkInsert("memo", bulk, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("memo", null, {});
  },
};
