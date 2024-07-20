import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 32
  },
  password: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    minlength: 5,
    maxlength: 32,
    unique: true,
    set: (v) => v.toLowerCase(),
  },
  numberOfLogins: {
    type: Number,
    default: 0,
  },
  lastLogin: {
    type: Date,
  },
  token: {
    type: String,
  },
  profilePicture: {
    type: String,
    default: "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
  },
  bio: {
    type: String,
  },
  role: {
    type: String,
    enum: ['USER', 'ADMIN'],
  },
  gender: {
    type: String,
    enum: ['MALE', 'FEMALE'],
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  OTP: {
    type: String,
  },
  OTPExpireDate: {
    type: Date
  },
  otpRequests: {
    type: Number,
    default: 0,
  },
  friends: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ]
}, { timestamps: true }
)

userSchema.pre('save', async function (next) {
  if (this.isNew || this.isModified('password')) {
    this.password = await bcrypt.hash(
      (this.password + process.env.PEPPER),
      parseInt(process.env.SALT_ROUNDS)
    );
  }
  next();
});

userSchema.methods.comparePassword = async function (password) {
  return await bcrypt.compare(
    (password + process.env.PEPPER),
    this.password
  );
};

export default model('User', userSchema);
