'use strict';
const bcrypt = require('bcrypt');

const generateHash = (plaintextPassword) => bcrypt.hashSync(plaintextPassword, 3);


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const users = [
      {
        username: "virgil",
        password: generateHash("password"),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        username: "a",
        password: generateHash("a"),
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Users', users, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
  }
};
