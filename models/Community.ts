import mongoose, { Schema, model, Types, Document } from "mongoose";

// Interfaz de TypeScript para el modelo Community
interface ICommunity extends Document {
  name: string;
  description: string;
  slug: string;
  admins: Types.ObjectId[];
  moderators: Types.ObjectId[];
  members: Types.ObjectId[];
  posts: Types.ObjectId[];
  rules: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Definición del esquema de Community en Mongoose
const communitySchema = new Schema<ICommunity>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    admins: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    moderators: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    members: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    rules: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

const Community = mongoose.models.Community || mongoose.model<ICommunity>("Community", communitySchema);

export default Community;
