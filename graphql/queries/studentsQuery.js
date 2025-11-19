const { 
    GraphQLList,
} = require('graphql');
const StudentType = require('../types/StudentType');
const db = require('../../models');

const resolver = async (_, args, context) => {
    const isAdminUser = context.user.role === "admin";

    if(!isAdminUser) {
        return [];
    }
    
    const students = await db.Student.findAll();
    return students;
}

const studentsQuery = {
    type: new GraphQLList(StudentType),
    resolve: resolver,
}

module.exports = studentsQuery;