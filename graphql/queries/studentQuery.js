const {
    GraphQLInt,
    GraphQLError,
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

        // const student = await db.Student.findByPk(id, {
        //     include: [{
        //         model: db.Lecture,
        //         as: 'lectures',
        //     }]
        // });

        const student = await db.Student.findByPk(id);

        if(!student) {
          throw new GraphQLError("Not found");
        }

        const lectures = await student.getLectures();
        student.lectures = lectures;

        return student;
    }
}

module.exports = studentQuery;
