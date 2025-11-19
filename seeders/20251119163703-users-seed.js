'use strict';
// cjs f***ery that does not work
// const { faker } = require('@faker-js/faker');

// function createRandomUser() {
//   return {
//     firstName: faker.person.firstName(),
//     lastName: faker.person.lastName(),
//     email: faker.internet.email(),
//     password: faker.internet.password(),
//   };
// }

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const users = [
      {
        username: "virgil",
        password: "password",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "a",
        password: "a",
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    // const users = faker.helpers.multiple(createRandomUser, {
    //   count: 5,
    // });

    await queryInterface.bulkInsert('Users', users, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
