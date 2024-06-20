import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
  name: {
    type: String,
    // unique: true,
    // index: true,
  },
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  age: {
    type: Number,
    min: 20,
    max: 50,
    required: true,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
  },
  blood_type: {
    type: String,
    enum: { values: ['A', 'B', 'A+'], message: 'invalid blood type' },
  },
  status: {
    type: String,
    required: [true, 'status is required'],
  },
  email: String,
});

userSchema.index({ lname: 1, fname: 1 }, { unique: true });
userSchema.index({ name: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
