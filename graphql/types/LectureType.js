const { GraphQLObjectType, GraphQLInt, GraphQLString } = require('graphql');

const LectureType = new GraphQLObjectType({
    name: "Lecture",
    fields: {
        id: {
            type: GraphQLInt,
        },
        name: {
            type: GraphQLString
        }
    }
});

module.exports = LectureType;