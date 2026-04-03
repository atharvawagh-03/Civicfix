import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    userId: { type: String, unique: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ['citizen', 'admin'], default: 'citizen' },
  },
  { timestamps: true }
);

userSchema.pre('save', function setUserId(next) {
  if (!this.userId && this._id) this.userId = this._id.toString();
  next();
});

export const User = mongoose.model('User', userSchema);
