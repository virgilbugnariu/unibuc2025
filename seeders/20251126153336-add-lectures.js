'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const lectures = [
      {
        name: 'Introduction to Computer Science',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Data Structures and Algorithms',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Web Development',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Database Systems',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('Lectures', lectures, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Lectures', null, {});
  }
};