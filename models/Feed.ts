import mongoose, { Schema, Document, Types } from 'mongoose';

// About:
// Custom feeds allow users to create personalized feeds based on multiple communities, meaning all the content is in one place. Custom feeds are great for grouping communities that are about the same topic.

// Interfaz para el documento Feed
interface IFeed extends Document {
  creatorId: Types.ObjectId;
  posts: Types.ObjectId[];
}

// Esquema de Feed
const FeedSchema = new Schema<IFeed>({
  creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
}, { timestamps: true });

export default mongoose.models.Feed || mongoose.model<IFeed>('Feed', FeedSchema);
