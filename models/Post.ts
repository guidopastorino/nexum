import { MediaFile } from '@/types/types';
import mongoose, { Schema, model, Types, Document } from 'mongoose';

// Subesquema para MediaFile
const MediaFileSchema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  key: { type: String, required: true },
  lastModified: { type: Number, required: true },
  url: { type: String, required: true },
  appUrl: { type: String, required: true },
  customId: { type: String, default: null },
  type: { type: String, required: true },
  fileHash: { type: String, required: true },
});

interface PostDocument extends Document {
  _id: string;
  maskedId: string;
  creator: Types.ObjectId;
  communityId?: Types.ObjectId;
  content: string;
  likes: Types.ObjectId[];
  comments: Types.ObjectId[];
  bookmarks: Types.ObjectId[];
  quotes: Types.ObjectId;
  reposts: Types.ObjectId;
  repostedFrom?: Types.ObjectId;
  quotedPost?: Types.ObjectId;
  media: MediaFile[];
  // for reply posts
  parentPost?: string | null;
  replyingTo?: string | null;
  type: 'normal' | 'repost' | 'quote' | 'reply';
}

const PostSchema = new Schema<PostDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maskedId: { type: String, required: true, unique: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community' },
    content: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    bookmarks: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    quotes: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
    reposts: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repostedFrom: { type: Schema.Types.ObjectId, ref: 'Post' },
    quotedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
    media: { type: [MediaFileSchema], default: [] },
    parentPost: { type: Schema.Types.ObjectId, ref: 'Post' }, // si esta opcion existe, el post es una respuesta
    replyingTo: { type: Schema.Types.ObjectId, ref: 'Post' }, // si esta opcion existe, el post es una respuesta
    type: { type: String, enum: ['normal', 'repost', 'quote'], default: 'normal' },
  },
  {
    timestamps: true,
  }
);

// Creación de índices
PostSchema.index({ content: 'text' }, { weights: { content: 1 } });
PostSchema.index({ communityId: 1, createdAt: -1 });
PostSchema.index({ creator: 1, createdAt: -1 });
PostSchema.index({ type: 1, createdAt: -1 });

export default mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);