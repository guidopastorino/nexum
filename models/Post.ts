import { MediaFile } from '@/types/types';
import mongoose, { Schema, model, Types, Document } from 'mongoose';

// Subesquema para ServerData
const ServerDataSchema = new Schema({
  uploadedBy: { type: String, required: true },
});

// Subesquema para MediaFile
const MediaFileSchema = new Schema({
  name: { type: String, required: true },
  size: { type: Number, required: true },
  key: { type: String, required: true },
  lastModified: { type: Number, required: true },
  serverData: { type: ServerDataSchema, required: true },
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
  repostedFrom?: Types.ObjectId;
  quotedPost?: Types.ObjectId;
  media: MediaFile[];
  type: 'normal' | 'repost' | 'quote'; // add reply option
  comments: Types.ObjectId[];
}

const PostSchema = new Schema<PostDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    maskedId: { type: String, required: true, unique: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community' },
    content: { type: String },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repostedFrom: { type: Schema.Types.ObjectId, ref: 'Post' },
    quotedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
    media: { type: [MediaFileSchema], default: [] },
    type: { type: String, enum: ['normal', 'repost', 'quote'], default: 'normal' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
  },
  {
    timestamps: true,
  }
);

// Creación de índices
PostSchema.index({ content: 'text' }, { weights: { content: 1 } });
PostSchema.index({ communityId: 1, createdAt: -1 });
PostSchema.index({ creator: 1, createdAt: -1 });

export default mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);


/*
  Campo   	     Tipo normal   	Tipo repost   	Tipo quote
  _id         	     Sí	            Sí             	Sí
  creator	           Sí            	Sí            	Sí
  communityId	       Sí	            Sí	            Sí
  content	           Sí	            No             	Sí
  likes       	     Sí            	No            	Sí
  repostedFrom	     No            	Sí            	No
  quotedPost  	     No            	No            	Sí
  media       	     Sí	            No            	Sí
  type         	     Sí            	Sí	            Sí
  comments     	     Sí            	No            	Sí
*/

// Example of every type's creation in the database

// normal
// required fields:
// creator (User schema _id), content (optional), media (optional), but at least, content or media.

// db example:
// {
//   "_id": {
//     "$oid": "67341d540cb38a56abea561a"
//   },
//   "creator": {
//     "$oid": "67324efcc8e861029bbe1a8f"
//   },
//   "content": "Testeando los posts!!!!",
//   "likes": [],
//   "type": "normal",
//   "comments": [],
//   "media": [
//     "https://utfs.io/f/L4TcJT5vSjNIzMgpzNShbpMj9WXPdiorO10ls6kTAtEJBN4R",
//     "https://utfs.io/f/L4TcJT5vSjNIzMgpzNShbpMj9WXPdiorO10ls6kTAtEJBN4R"
//   ],
//   "createdAt": {
//     "$date": "2024-11-12T23:58:16.885Z"
//   }
// }


// quote
// required fields:
// creator (User schema _id), content or media, quotedPost (Post schema id)

// db example:
// {
//   "_id": {
//     "$oid": "67341dab0cb38a56abea561b"
//   },
//   "creator": {
//     "$oid": "67324efcc8e861029bbe1a8f"
//   },
//   "content": "Jajajaja ahora testeando quotes!!!",
//   "likes": [],
//   "type": "quote",
//   "quotedPost": {
//     "$oid": "67341d540cb38a56abea561a"
//   },
//   "comments": [],
//   "media": [],
//   "createdAt": {
//     "$date": "2024-11-12T23:59:17.552Z"
//   }
// }


// repost
// required fields:
// creator (User schema _id), repostedFrom (Post schema id)

// db example:
// {
//   "_id": {
//     "$oid": "67341df20cb38a56abea561c"
//   },
//   "creator": {
//     "$oid": "67324efcc8e861029bbe1a8f"
//   },
//   "content": "",
//   "likes": [],
//   "repostedFrom": {
//     "$oid": "67341dab0cb38a56abea561b"
//   },
//   "type": "repost",
//   "comments": [],
//   "createdAt": {
//     "$date": "2024-11-12T23:59:58.429Z"
//   }
// }