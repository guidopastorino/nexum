import mongoose, { Schema, Document, Types } from 'mongoose';
import bcrypt from 'bcrypt';

interface IUser extends Document {
  fullname: string;
  username: string;
  isVerified: string;
  email: string;
  password: string;
  profileImage: string | null;
  bannerImage: string | null;
  description: string | null;
  following: Types.ObjectId[];
  followers: Types.ObjectId[];
  posts: Types.ObjectId[];
  feeds: Types.ObjectId[];
  likes: Types.ObjectId[];
  pinnedPosts: Types.ObjectId[]; // Posts fijados por el usuario
  bookmarkedPosts: Types.ObjectId[]; // Posts guardados por el usuario
  highlightedPosts: Types.ObjectId[]; // Posts destacados por el usuario
  mutedUsers: Types.ObjectId[]; // Usuarios silenciados por el usuario
  blockedUsers: Types.ObjectId[]; // Usuarios bloqueados por el usuario
  mutedConversations: Types.ObjectId[]; // Conversaciones silenciadas
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
    bannerImage: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      default: null
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
    feeds: [
      { type: Schema.Types.ObjectId, ref: 'Feed' }
    ],
    likes: [
      { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
    pinnedPosts: [
      { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
    bookmarkedPosts: [
      { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
    highlightedPosts: [
      { type: Schema.Types.ObjectId, ref: 'Post' }
    ],
    mutedUsers: [
      { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    blockedUsers: [
      { type: Schema.Types.ObjectId, ref: 'User' }
    ],
    mutedConversations: [
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
UserSchema.index({ isVerified: 1 });

const User = mongoose.models.User || mongoose.model<IUser>("User", UserSchema);

export default User;