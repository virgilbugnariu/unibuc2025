const StudentType = require("../types/StudentType");
const CreateStudentInputType = require("../inputTypes/CreateStudentInputType");
const db = require("../../models");

const createStudentMutation = {
            type: StudentType,
            args: {
                input: {
                    type: CreateStudentInputType,
                }
            },
            resolve: async (_, args) => {
                const { firstName, lastName, age } = args.input;
                
                const student = await db.Student.create({
                    firstName,
                    lastName,
                    age,
                });

                return student;

            }
        }

module.exports = createStudentMutation;