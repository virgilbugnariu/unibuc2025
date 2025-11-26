'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const studentLectures = [
      // John Appleseed (studentId: 1) enrolled in multiple lectures
      {
        studentId: 1,
        lectureId: 1, // Introduction to Computer Science
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 1,
        lectureId: 2, // Data Structures and Algorithms
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 1,
        lectureId: 3, // Web Development
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      // Mary The lamb (studentId: 2) enrolled in multiple lectures
      {
        studentId: 2,
        lectureId: 1, // Introduction to Computer Science
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        lectureId: 3, // Web Development
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        studentId: 2,
        lectureId: 4, // Database Systems
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