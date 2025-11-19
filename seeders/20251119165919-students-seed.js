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

    const students = [
       {
            firstName: 'John',
            lastName: 'Appleseed',
            age: 21,
            createdAt: new Date(),
            updatedAt: new Date(),
        },
        {
            firstName: 'Mary',
            lastName: 'The lamb',
            age: 21,
            createdAt: new Date(),
            updatedAt: new Date(),
        }
    ];

    // const users = faker.helpers.multiple(createRandomUser, {
    //   count: 5,
    // });

    await queryInterface.bulkInsert('Students', students, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Students', null, {});
  }
};
