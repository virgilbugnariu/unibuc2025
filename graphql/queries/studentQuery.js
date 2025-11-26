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

        // const student = await db.Student.findByPk(id, {
        //     include: [{
        //         model: db.Lecture,
        //         as: 'lectures',
        //         through: { attributes: [] }
        //     }]
        // });


        const student = await db.Student.findByPk(id);
        const lectures = await student.getLectures();
        student.lectures = lectures;

        return student;
    }
}

module.exports = studentQuery;