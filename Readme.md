# Module-5-Advance-CRUD-Operation-With-Express-Mongoose-Typescript

GitHub Link: https://github.com/Apollo-Level2-Web-Dev/Level2-Batch4-PH-University-Server/tree/advanced-crud

This module focuses on validation, covering topics such as an introduction to validation, utilizing the Joi package, custom validation, and techniques like instance method validation and Zod integration. A basic understanding of validation, while we explores practical validation using Joi, including instance methods and advanced JOD techniques. By the end, you'll be equipped with the skills to confidently validate data in TypeScript. Let's dive into the exciting world of validation!

# Intro To Validation

![alt text](image.png)

- In mongoose we can validate like what should be the data type like string, number or boolean. If we want to validate lie the length of phone number according to different countries, validating right format of email is written or not, we can used different method.

### validations in mongoose

1. builtin validation
2. custom validation
3. third party validation lie (validator/zod/joi)

![alt text](image-1.png)

![alt text](image-2.png)

![alt text](image-3.png)

- Inside student.schema.ts

```ts
// student.schema.ts

  // problematic enum
  // gender: ['male', 'female'],
  // fixed enum
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
```

```ts
// student.schema.ts

  // problematic enum
  // bloodGroup: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  // fixed enum
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
```

- Enum fix and default value setting

```ts
// student.schema.ts

  // problematic enum
  // isActive: ['active', 'blocked'],

  // fixed enum
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    // default value setting
    default: 'active',
  },
```

- Bug fix from previous student.schema.ts, since those was not made required

```ts
// student.schema.ts
  name: {
    type: userNameSchema,
    required: true,
  },

    guardian: {
    type: guardianSchema,
    required: true,
  },
  localGuardian: {
    type: localGuardian,
    required: true,
  },
```

- If we ant to send any custom message if anything required has been missed. We can set error message in the required field. The error message will be shown in the command section where are running the server

```ts
// student.schema.ts
  name: {
    type: userNameSchema,
    required: [true, 'First name labei lagbe'],
  },
```

- For setting a custom message in the enum we have to do

```ts
// student.schema.ts
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: 'Gender must be either "male", "female", or "other"',
    },
    required: [true, 'Gender is Required'],
  },
```

- If we want to grab the exact value from client and show in the message

```ts
// student.schema.ts
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not valid Gender must be either "male", "female", or "other"',
    },
    required: [true, 'Gender is Required'],
  },
```

- If we want the id to be unique and no repeat

```ts
// student.schema.ts
  id: {
    type: String,
    required: true,
    unique:true
  },

```

## How to do custom validation

- we can set max length of a schema types

```ts
// student.schema.ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    maxlength: 20,
  },
```

- We set a custom message with the max length

```ts
// student.schema.ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    maxlength: [20, 'Name should be less than 20 letter']
  },
```

- We can send the error message to client as well

```ts
//  inside student.controller.ts
const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // will call service function to send this data
    const result = await StudentServices.createStudentInDB(studentData);

    // send response
    res.status(200).json({
      success: true,
      message: 'Student Is Created Successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};
```

- If we want to remove the unnecessary spaces between the words we can use trim

```ts
// student.schema.ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    maxlength: [20, 'First Name should not be more than 20 letter'],
  },
```

### Custom Validator

- we will use normal function because dist will not work in arrow function
-

```ts
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true, // Names often have unwanted whitespace
    maxlength: [20, 'First Name should not be more than 20 letters'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);
        // console.log(value);
        // if (value !== firstNameStr) {
        //   return false;
        // }
        // return true;

        // shortcut
        return firstNameStr === value;
      },
      message: '{VALUE} is not capitalized Format',
    },
  },
```

## How to validate using validator and Joi package

- Custom made validation will take more time. so that we will use validation library

### Using Npm Validator

- Easiest validator npm package is [Validator Npm](https://www.npmjs.com/package/validator)
- npm i validator
- By default this validator does not support typescript
- We should use npm i -D @types/validator this. [typescript enabled validator system of this npm](https://www.npmjs.com/package/@types/validator)
- Follow the installation process [Validator npm Home page](https://github.com/validatorjs/validator.js)
- Import inside student.schema.ts i mean in the model

  ```ts
  import validator from 'validator';
  ```

  - Validator npm in last name

```ts
    // using npm validator
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      // here normal function will work since we are not using custom validator
      message: '{VALUE} is not valid',
    },
  },
```

```ts

  // using npm validator
  email: {
    type: String,
    required: [true, 'Email is Required'],
    unique: true, // Email typically doesn't need trimming here
    trim: true, // Trim for ensuring valid input
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: '{VALUE} is not a email type',
    },
  },

```

## How to validate using zod

- For More Organized way we can use ZOD [ZOD Documentation](https://zod.dev/)

- ZOD is Better than JOI
- npm install zod
- zod can infer and define typescript type

```ts
// student.validation.ts
import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First Name is Required')
    .max(20, 'Name cannot be more than 20 characters')
    .trim(),
  middleName: z.string().trim().optional(),
  lastName: z.string().min(1, 'Last Name is Required').trim(),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is Required').trim(),
  fatherOccupation: z.string().min(1, 'Father Occupation is Required').trim(),
  fatherContactNo: z.string().min(1, 'Father Contact No Required').trim(),
  motherName: z.string().min(1, 'Mother Name is Required').trim(),
  motherOccupation: z.string().min(1, 'Mother Occupation is Required').trim(),
  motherContactNo: z.string().min(1, 'Mother Contact No Required').trim(),
});

const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name Required').trim(),
  occupation: z.string().min(1, 'Local Guardian Occupation Required').trim(),
  contactNo: z.string().min(1, 'Local Guardian Contact No Required').trim(),
  address: z.string().min(1, 'Local Guardian Address Required').trim(),
});

const studentValidationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: 'Gender is not valid' }),
  }),
  dateOfBirth: z.string().optional(),
  email: z.string().email('Invalid email format'),
  contactNo: z.string().min(1, 'Contact No Required').trim(),
  emergencyContactNo: z.string().min(1, 'Emergency Contact No Required').trim(),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional(),
  presentAddress: z.string().min(1, 'Present Address Required').trim(),
  permanentAddress: z.string().min(1, 'Permanent Address Required').trim(),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().min(1, 'Profile Image Required').trim(),
  isActive: z.enum(['active', 'blocked']).default('active'),
});

export default studentValidationSchema;
```

```ts
import { Request, Response } from 'express';
import { StudentServices } from './student.services';
import studentValidationSchema from './student.validation';

// import studentValidationSchema from './student.joi.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // using zod
    const zodValidationData = await studentValidationSchema.parse(studentData);
    // will call service function to send this data
    const result = await StudentServices.createStudentInDB(zodValidationData);

    // send response
    res.status(200).json({
      success: true,
      message: 'Student Is Created Successfully',
      data: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Something went wrong',
      error: err,
    });
  }
};

// for getting all students
const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();
    // send response
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};

// for getting single students
const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);
    // send response
    res.status(200).json({
      success: true,
      message: 'Students is retrieved successfully',
      data: result,
    });
  } catch (err) {
    console.log(err);
  }
};
export const StudentController = {
  createStudent,
  getAllStudents,
  getSingleStudent,
};
```
