const { GraphQLObjectType, GraphQLInt, GraphQLString, GraphQLList } = require('graphql');
const LectureType = require('./LectureType');

const StudentType = new GraphQLObjectType({
    name: "Student",
    fields: {
        id: {
            type: GraphQLInt,
        },
        firstName: {
            type: GraphQLString,
        },
        lastName: {
            type: GraphQLString,
        },
        age: {
            type: GraphQLInt,
        },
        lectures: {
            type: new GraphQLList(LectureType),
        }
    }
});

module.exports = StudentType;