const { 
    GraphQLList,
} = require('graphql');
const StudentType = require('../types/StudentType');
const { listEntities } = require('../../fakeDb');

const resolver = () => {
    return listEntities('students');
}

const studentsQuery = {
    type: new GraphQLList(StudentType),
    resolve: resolver,
}

module.exports = studentsQuery;