import { Schema, model } from 'mongoose';
import {
  Student,
  UserName,
  Guardian,
  LocalGuardian,
} from './student.interface';

const userNameSchema = new Schema<UserName>({
  firstName: {
    type: String,
    required: [true, 'First Name is Required'],
    trim: true,
    maxlength: [20, 'Name can not be more than 20 char'],
    validate: {
      validator: function (value: string) {
        const firstNameStr = value.charAt(0).toUpperCase() + value.slice(1);

        return firstNameStr === value;
        // if(value !== firstNameStr){
        //   return false
        // } return true
      },
      message: '{VALUE} Is Not Inj Capitalized Format',
    },
  },
  middleName: {
    type: String,
    trim: true,
  },
  lastName: {
    type: String,
    required: [true, 'Last Name is Required'],
    trim: true,
  },
});

const guardianSchema = new Schema<Guardian>({
  fatherName: {
    type: String,
    required: [true, 'Father Name is Required'],
    trim: true,
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father Occupation Is Required'],
    trim: true,
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father  Contact No Required'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother Name is Required'],
    trim: true,
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother Occupation Is Required'],
    trim: true,
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother  Contact No Required'],
  },
});

const localGuardianSchema = new Schema<LocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local Guardian Name Required'],
    trim: true,
  },
  occupation: {
    type: String,
    required: [true, 'Local Guardian Occupation Required'],
    trim: true,
  },
  contactNo: {
    type: String,
    required: [true, 'Local Guardian Contact No Required'],
    trim: true,
  },
  address: {
    type: String,
    required: [true, 'Local Guardian Address Required'],
  },
});

const studentSchema = new Schema<Student>({
  id: { type: String, required: true, unique: true },
  name: {
    type: userNameSchema,
    required: [true, 'Name is Required'],
  },
  //   this is predefined property so i will use enum
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} Is Not a Valid Input',
    },
    required: [true, 'Gender Is Required'],
  },
  dateOfBirth: { type: String },
  email: { type: String, required: [true, 'Email Required'], unique: true },
  contactNo: { type: String, required: [true, 'Contact No Required'] },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency Contact No Required'],
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
  },
  presentAddress: {
    type: String,
    required: [true, 'Present Address Required'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent Address Required'],
  },
  guardian: {
    type: guardianSchema,
    required: [true, 'Guardian Info Required'],
  },
  localGuardian: {
    type: localGuardianSchema,
    required: [true, 'Local Guardian Info Required'],
  },
  profileImg: { type: String, required: [true, 'Profile Image Required'] },
  isActive: {
    type: String,
    enum: ['active', 'blocked'],
    default: 'active',
  },
});

export const StudentModel = model<Student>('Student', studentSchema);
