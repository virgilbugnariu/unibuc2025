const express = require('express');
const app = express();
const port = 3009;
const fs = require("fs/promises");
const { createHandler } = require('graphql-http/lib/use/http');
const { 
    GraphQLSchema, 
} = require('graphql');

const QueryType = require('./grapqhl/rootType/queryType');
const MutationType = require('./grapqhl/rootType/MutationType');

let lastId = 2;

let studentsTable = [
    
];

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

const graphQLHandler = createHandler({
    schema,
});

app.post('/graphql', graphQLHandler);









app.use(express.json());


app.get('/student', async (req, res) => {
    const data = await fs.readFile('students.json');
    const response = JSON.parse(data.toString());
    res.json(response);
});

app.get('/student/:studentId', (request, response) => {
    const targetStudentId = parseInt(request.params.studentId);

    const targetStudent = studentsTable.find((student) => {
        return student.id === targetStudentId;
    });

    if(!targetStudent) {
        response.json({
            status: 'not_found',
        });

        return;
    }
    response.json(targetStudent);
});

app.post('/student', (request, response) => {
    console.log(request.body);
    const { firstName, lastName } = request.body;

    const newStudent = {
        id: lastId + 1,
        firstName,
        lastName,
    };

    studentsTable.push(newStudent);
    lastId += 1;
    response.json(newStudent);
});

app.delete('/student/:studentId', (request, response) => {
    const targetStudentId = parseInt(request.params.studentId);

    studentsTable = studentsTable.filter((student) => {
        return student.id !== targetStudentId;
    });

    response.status(200).send();
});

app.post('/student/:studentId', (request, response) => {
    const targetStudentId = parseInt(request.params.studentId);
    
    const { firstName, lastName } = request.body;

    studentsTable = studentsTable.map((student) => {
        if(student.id === targetStudentId) {
            return {
                id: targetStudentId,
                firstName,
                lastName,
            }
        }

        return student;
    });

    const updatedStudent = studentsTable.find((student) => {
        return student.id === targetStudentId;
    });

    response.json(updatedStudent);
});

module.exports = {
    app,
    port,
};