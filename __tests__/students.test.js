const { app } = require('../app');
const { graphqlRequest, createTestUser, createTestStudent } = require('./helpers');
const db = require('../models');

describe('Students Query', () => {
  let adminToken;
  let regularUserToken;

  beforeEach(async () => {
    await db.Student.destroy({ where: {} });
    await db.User.destroy({ where: {} });

    const adminUser = await createTestUser({
      username: 'admin',
      password: 'adminpass',
      role: 'admin',
    });
    adminToken = adminUser.token;

    const regularUser = await createTestUser({
      username: 'user',
      password: 'userpass',
      role: 'user',
    });
    regularUserToken = regularUser.token;
  });

  const STUDENTS_QUERY = `
    query GetStudents {
      students {
        id
        firstName
        lastName
        age
      }
    }
  `;

  test('should return all students for admin user', async () => {
    await createTestStudent({ firstName: 'Alice', lastName: 'Smith', age: 20 });
    await createTestStudent({ firstName: 'Bob', lastName: 'Jones', age: 22 });
    await createTestStudent({ firstName: 'Carol', lastName: 'Williams', age: 21 });

    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.students).toHaveLength(3);
    expect(response.body.data.students).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ firstName: 'Alice', lastName: 'Smith' }),
        expect.objectContaining({ firstName: 'Bob', lastName: 'Jones' }),
        expect.objectContaining({ firstName: 'Carol', lastName: 'Williams' }),
      ])
    );
  });

  test('should return empty array for non-admin user', async () => {
    await createTestStudent({ firstName: 'Alice', lastName: 'Smith', age: 20 });
    await createTestStudent({ firstName: 'Bob', lastName: 'Jones', age: 22 });

    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, regularUserToken);

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.students).toEqual([]);
  });

  test('should return empty array when no students exist (admin)', async () => {
    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.students).toEqual([]);
  });

  test('should return empty array when no students exist (non-admin)', async () => {
    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, regularUserToken);

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.students).toEqual([]);
  });

  test('should return all student fields correctly for admin', async () => {
    const student = await createTestStudent({
      firstName: 'David',
      lastName: 'Brown',
      age: 25,
    });

    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);

    expect(response.status).toBe(200);
    expect(response.body.data.students[0]).toMatchObject({
      id: student.id,
      firstName: 'David',
      lastName: 'Brown',
      age: 25,
    });
  });

  test('should handle large number of students for admin', async () => {
    const studentPromises = [];
    for (let i = 0; i < 50; i++) {
      studentPromises.push(
        createTestStudent({
          firstName: `Student${i}`,
          lastName: `Last${i}`,
          age: 18 + (i % 10),
        })
      );
    }
    await Promise.all(studentPromises);

    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.students).toHaveLength(50);
  });

  test('should return empty array for non-admin even with many students', async () => {
    await createTestStudent({ firstName: 'Student1', lastName: 'Last1', age: 20 });
    await createTestStudent({ firstName: 'Student2', lastName: 'Last2', age: 21 });
    await createTestStudent({ firstName: 'Student3', lastName: 'Last3', age: 22 });

    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, regularUserToken);

    expect(response.status).toBe(200);
    expect(response.body.data.students).toEqual([]);
  });

  test('should enforce authorization without token', async () => {
    await createTestStudent({ firstName: 'Test', lastName: 'Student', age: 20 });

    const response = await graphqlRequest(app, STUDENTS_QUERY, {});

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeDefined();
  });

  test('should return students in consistent order for admin', async () => {
    await createTestStudent({ firstName: 'Zara', lastName: 'Last', age: 20 });
    await createTestStudent({ firstName: 'Alice', lastName: 'First', age: 21 });
    await createTestStudent({ firstName: 'Mike', lastName: 'Middle', age: 22 });

    const response1 = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);
    const response2 = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);

    expect(response1.body.data.students).toEqual(response2.body.data.students);
  });

  test('admin should see newly created students', async () => {
    await createTestStudent({ firstName: 'Initial', lastName: 'Student', age: 20 });

    let response = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);
    expect(response.body.data.students).toHaveLength(1);

    await createTestStudent({ firstName: 'New', lastName: 'Student', age: 21 });

    response = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);
    expect(response.body.data.students).toHaveLength(2);
  });

  test('should include all required fields in response', async () => {
    await createTestStudent({ firstName: 'Test', lastName: 'Student', age: 20 });

    const response = await graphqlRequest(app, STUDENTS_QUERY, {}, adminToken);

    expect(response.status).toBe(200);
    const student = response.body.data.students[0];
    expect(student).toHaveProperty('id');
    expect(student).toHaveProperty('firstName');
    expect(student).toHaveProperty('lastName');
    expect(student).toHaveProperty('age');
  });
});
