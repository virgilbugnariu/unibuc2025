'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lecture extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Lecture.belongsToMany(models.Student, {
        through: models.StudentLecture,
        foreignKey: 'lectureId',
        otherKey: 'studentId',
        as: 'students',
      });
    }
  }
  Lecture.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Lecture',
  });
  return Lecture;
};