import mongoose, { Schema } from 'mongoose';
const userSchema = new Schema({
  name: {
    type: String,
    unique: true,
  },
  fname: {
    type: String,
  },
  lname: {
    type: String,
  },
  age: {
    type: String,
    min: 20,
    max: 50,
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
  },
  status: {
    type: String,
  },
  email: String,
});

userSchema.index({ lname: 1, fname: 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
