import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt'

interface IUser extends Document {
  fullname: string;
  username: string;
  isVerified: string;
  email: string;
  password: string;
  profileImage: string | null;
  following: Types.ObjectId[]; // Usuarios seguidos
  followers: Types.ObjectId[]; // Usuarios seguidores
  posts: Types.ObjectId[]; // Posts creados por el usuario
  likes: Types.ObjectId[]; // Posts que ha dado like
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema = new Schema(
  {
    fullname: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      default: null,
    },
    following: [
      { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    followers: [
      { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    posts: [
      { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
    likes: [
      { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
  },
  {
    timestamps: true,
  }
);

// Hashear password antes de guardar el usuario
UserSchema.pre<IUser>('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar contraseña
UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

// Indices para mejorar consultas de seguidores y seguidos
UserSchema.index({ username: 1, email: 1 });
UserSchema.index({ email: 1 });
UserSchema.index({ isVerified: 1 });

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;