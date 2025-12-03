const { app } = require('../app');
const { graphqlRequest, createTestUser, createTestStudent, createTestLecture } = require('./helpers');
const db = require('../models');

describe('Student Query', () => {
  let token;

  beforeEach(async () => {
    await db.StudentLecture.destroy({ where: {} });
    await db.Lecture.destroy({ where: {} });
    await db.Student.destroy({ where: {} });
    await db.User.destroy({ where: {} });

    const testUser = await createTestUser();
    token = testUser.token;
  });

  const STUDENT_QUERY = `
    query GetStudent($id: Int!) {
      student(id: $id) {
        id
        firstName
        lastName
        age
        lectures {
          id
          name
        }
      }
    }
  `;

  test('should fetch a student by id without lectures', async () => {
    const student = await createTestStudent({
      firstName: 'John',
      lastName: 'Doe',
      age: 20,
    });

    const response = await graphqlRequest(
      app,
      STUDENT_QUERY,
      { id: student.id },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.student).toMatchObject({
      id: student.id,
      firstName: 'John',
      lastName: 'Doe',
      age: 20,
      lectures: [],
    });
  });

  test('should fetch a student with associated lectures', async () => {
    const student = await createTestStudent({
      firstName: 'Alice',
      lastName: 'Smith',
      age: 22,
    });

    const lecture1 = await createTestLecture({
      name: 'Math 101',
    });

    const lecture2 = await createTestLecture({
      name: 'Physics 101',
    });

    await student.addLecture(lecture1);
    await student.addLecture(lecture2);

    const response = await graphqlRequest(
      app,
      STUDENT_QUERY,
      { id: student.id },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.student).toMatchObject({
      id: student.id,
      firstName: 'Alice',
      lastName: 'Smith',
      age: 22,
    });
    expect(response.body.data.student.lectures).toHaveLength(2);
    expect(response.body.data.student.lectures).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'Math 101' }),
        expect.objectContaining({ name: 'Physics 101' }),
      ])
    );
  });

  test('should return error for non-existent student id', async () => {
    const response = await graphqlRequest(
      app,
      STUDENT_QUERY,
      { id: 99999 },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
    expect(response.body.errors[0].message).toBe('Not found');
    expect(response.body.data.student).toBeNull();
  });

  test('should fetch student with single lecture', async () => {
    const student = await createTestStudent({
      firstName: 'Bob',
      lastName: 'Johnson',
      age: 21,
    });

    const lecture = await createTestLecture({
      name: 'Chemistry 101',
    });

    await student.addLecture(lecture);

    const response = await graphqlRequest(
      app,
      STUDENT_QUERY,
      { id: student.id },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.student.lectures).toHaveLength(1);
    expect(response.body.data.student.lectures[0]).toMatchObject({
      id: lecture.id,
      name: 'Chemistry 101',
    });
  });

  test('should work without authentication token', async () => {
    const student = await createTestStudent({
      firstName: 'NoAuth',
      lastName: 'Student',
      age: 20,
    });

    const response = await graphqlRequest(app, STUDENT_QUERY, { id: student.id });

    expect(response.status).toBe(200);
    expect(response.body.data.student).toBeDefined();
    expect(response.body.data.student.id).toBe(student.id);
  });

  test('should fetch multiple different students correctly', async () => {
    const student1 = await createTestStudent({
      firstName: 'Student',
      lastName: 'One',
      age: 19,
    });

    const student2 = await createTestStudent({
      firstName: 'Student',
      lastName: 'Two',
      age: 23,
    });

    const response1 = await graphqlRequest(
      app,
      STUDENT_QUERY,
      { id: student1.id },
      token
    );

    const response2 = await graphqlRequest(
      app,
      STUDENT_QUERY,
      { id: student2.id },
      token
    );

    expect(response1.body.data.student.lastName).toBe('One');
    expect(response2.body.data.student.lastName).toBe('Two');
  });

  test('should include all lecture details', async () => {
    const student = await createTestStudent();
    const lecture = await createTestLecture({
      name: 'Advanced Programming',
    });

    await student.addLecture(lecture);

    const response = await graphqlRequest(
      app,
      STUDENT_QUERY,
      { id: student.id },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.data.student.lectures[0]).toHaveProperty('id');
    expect(response.body.data.student.lectures[0]).toHaveProperty('name');
  });
});
