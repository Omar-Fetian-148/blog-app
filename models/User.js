import { model, Schema } from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new Schema({
  username: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
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
