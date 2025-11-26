'use strict';
// cjs f***ery that does not work
const { faker } = require('@faker-js/faker');

function createRandomUser() {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    age: 18,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
}

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const students = faker.helpers.multiple(createRandomUser, {
      count: 5,
    });

    await queryInterface.bulkInsert('Students', students, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Students', null, {});
  }
};
