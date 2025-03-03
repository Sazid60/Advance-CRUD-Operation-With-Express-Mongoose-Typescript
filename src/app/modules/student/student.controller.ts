import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import Joi from 'joi';

// (req: Request, res: Response) will come from express typeScript type declaration

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // Validation using joi

    const JoiValidationSchema = Joi.object({
      id: Joi.string(),
      name: {
        firstName: Joi.string().max(20).required(),
        middleName: Joi.string().max(20),
        lastName: Joi.string().max(20).required(),
      },
      gender: Joi.string().required().valid(['male', 'female', 'other']),
    });

    //  will call service function to send this data
    const result = await StudentServices.createStudentIntoDB(studentData);
    //  send response
    res.status(200).json({
      success: true,
      message: 'Student is Created Successfully',
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Something Went Wrong',
      error: error,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    res.status(200).json({
      success: true,
      message: 'Student are retrieved Successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    res.status(200).json({
      success: true,
      message: 'Single Student are retrieved Successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

export const StudentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
