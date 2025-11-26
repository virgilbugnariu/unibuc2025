'use strict';
const db = 
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const studentLectures = [
      {
        studentId: 1,
        lectureId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 1,
        lectureId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 1,
        lectureId: 3,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        lectureId: 1, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        lectureId: 3, 
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        lectureId: 4,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ];

    await queryInterface.bulkInsert('StudentLectures', studentLectures, {});

  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('StudentLectures', null, {});
  }
};