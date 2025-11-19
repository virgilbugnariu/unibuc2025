const { 
    GraphQLInt,
} = require('graphql');
const StudentType = require('../types/StudentType');
const db = require('../../models');

const studentQuery = {
    type: StudentType,
    args: {
        id: {
            type: GraphQLInt,
        },
    },
    resolve: async (_, args) => {
        const { id } = args;
        
        const student = await db.Student.findByPk(id);

        return student;
    }
}

module.exports = studentQuery;