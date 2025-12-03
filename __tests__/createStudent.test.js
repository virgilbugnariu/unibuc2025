const { app } = require('../app');
const { graphqlRequest, createTestUser } = require('./helpers');
const db = require('../models');

describe('CreateStudent Mutation', () => {
  let token;

  beforeEach(async () => {
    await db.Student.destroy({ where: {} });
    await db.User.destroy({ where: {} });

    const testUser = await createTestUser();
    token = testUser.token;
  });

  const CREATE_STUDENT_MUTATION = `
    mutation CreateStudent($input: CreateStudentInputType!) {
      createStudent(input: $input) {
        id
        firstName
        lastName
        age
      }
    }
  `;

  test('should create a student with valid data', async () => {
    const response = await graphqlRequest(
      app,
      CREATE_STUDENT_MUTATION,
      {
        input: {
          firstName: 'Alice',
          lastName: 'Smith',
          age: 22,
        },
      },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.createStudent).toMatchObject({
      firstName: 'Alice',
      lastName: 'Smith',
      age: 22,
    });
    expect(response.body.data.createStudent.id).toBeDefined();

    const student = await db.Student.findByPk(response.body.data.createStudent.id);
    expect(student).toBeDefined();
    expect(student.firstName).toBe('Alice');
  });

  test('should create a student with minimum age', async () => {
    const response = await graphqlRequest(
      app,
      CREATE_STUDENT_MUTATION,
      {
        input: {
          firstName: 'Young',
          lastName: 'Student',
          age: 18,
        },
      },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.createStudent.age).toBe(18);
  });

  test('should create a student with maximum realistic age', async () => {
    const response = await graphqlRequest(
      app,
      CREATE_STUDENT_MUTATION,
      {
        input: {
          firstName: 'Senior',
          lastName: 'Student',
          age: 65,
        },
      },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.createStudent.age).toBe(65);
  });

  test('should create multiple students with different data', async () => {
    const students = [
      { firstName: 'Bob', lastName: 'Jones', age: 20 },
      { firstName: 'Carol', lastName: 'Williams', age: 21 },
      { firstName: 'David', lastName: 'Brown', age: 19 },
    ];

    for (const studentData of students) {
      const response = await graphqlRequest(
        app,
        CREATE_STUDENT_MUTATION,
        { input: studentData },
        token
      );

      expect(response.status).toBe(200);
      expect(response.body.errors).toBeUndefined();
      expect(response.body.data.createStudent).toMatchObject(studentData);
    }

    const allStudents = await db.Student.findAll();
    expect(allStudents).toHaveLength(3);
  });

  test('should work without authentication token', async () => {
    const response = await graphqlRequest(app, CREATE_STUDENT_MUTATION, {
      input: {
        firstName: 'NoAuth',
        lastName: 'Student',
        age: 20,
      },
    });

    expect(response.status).toBe(200);
    expect(response.body.data.createStudent).toBeDefined();
    expect(response.body.data.createStudent.firstName).toBe('NoAuth');
  });

  test('should persist student data correctly', async () => {
    const studentData = {
      firstName: 'Persistent',
      lastName: 'Student',
      age: 23,
    };

    const response = await graphqlRequest(
      app,
      CREATE_STUDENT_MUTATION,
      { input: studentData },
      token
    );

    const studentId = response.body.data.createStudent.id;

    const foundStudent = await db.Student.findByPk(studentId);
    expect(foundStudent).toBeDefined();
    expect(foundStudent.firstName).toBe(studentData.firstName);
    expect(foundStudent.lastName).toBe(studentData.lastName);
    expect(foundStudent.age).toBe(studentData.age);
  });

  test('should create students with special characters in names', async () => {
    const response = await graphqlRequest(
      app,
      CREATE_STUDENT_MUTATION,
      {
        input: {
          firstName: "O'Connor",
          lastName: 'Smith-Jones',
          age: 21,
        },
      },
      token
    );

    expect(response.status).toBe(200);
    expect(response.body.errors).toBeUndefined();
    expect(response.body.data.createStudent.firstName).toBe("O'Connor");
    expect(response.body.data.createStudent.lastName).toBe('Smith-Jones');
  });
});
