const { 
    GraphQLInt,
    GraphQLError,
} = require('graphql');
const StudentType = require('../types/StudentType');
const { findEntity } = require('../../fakeDb');

const studentQuery = {
    type: StudentType,
    args: {
        id: {
            type: GraphQLInt,
        },
    },
    resolve: async (_, args) => {
        const { id } = args;
        
        try {
            const result = await findEntity('students', id);
            return result; 
        } catch(exception) {
            throw new GraphQLError(exception);
        }
    }
}

module.exports = studentQuery;