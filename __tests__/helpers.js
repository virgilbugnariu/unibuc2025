const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { JWT_SECRET_KEY } = require('../constants');
const db = require('../models');

const graphqlRequest = (app, query, variables = {}, token = null) => {
  const req = request(app)
    .post('/graphql')
    .send({
      query,
      variables,
    });

  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }

  return req;
};

const createTestUser = async (userData = {}) => {
  const defaultData = {
    username: 'testuser',
    password: 'password123',
    role: 'user',
  };

  const data = { ...defaultData, ...userData };
  const hashedPassword = await bcrypt.hash(data.password, 10);

  const user = await db.User.create({
    username: data.username,
    password: hashedPassword,
    role: data.role,
  });

  const token = jwt.sign({ sub: user.id }, JWT_SECRET_KEY);

  return { user, token, plainPassword: data.password };
};

const createTestStudent = async (studentData = {}) => {
  const defaultData = {
    firstName: 'John',
    lastName: 'Doe',
    age: 20,
  };

  const data = { ...defaultData, ...studentData };

  const student = await db.Student.create(data);
  return student;
};

const createTestLecture = async (lectureData = {}) => {
  const defaultData = {
    name: 'Test Lecture',
  };

  const data = { ...defaultData, ...lectureData };

  const lecture = await db.Lecture.create(data);
  return lecture;
};

module.exports = {
  graphqlRequest,
  createTestUser,
  createTestStudent,
  createTestLecture,
};
