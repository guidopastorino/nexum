import mongoose, { Schema, model, Types, Document } from 'mongoose';

interface PostDocument extends Document {
  _id: string;
  creator: Types.ObjectId;
  communityId?: Types.ObjectId;
  content: string;
  tags?: string[];
  likes: Types.ObjectId[];
  repostedFrom?: Types.ObjectId;
  quotedPost?: Types.ObjectId;
  media?: string[];
  type: 'normal' | 'repost' | 'quote';
  comments: Types.ObjectId[];
  views: number;
}

const PostSchema = new Schema<PostDocument>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community' },
    content: { type: String, required: true },
    tags: { type: [String] },
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    repostedFrom: { type: Schema.Types.ObjectId, ref: 'Post' },
    quotedPost: { type: Schema.Types.ObjectId, ref: 'Post' },
    media: [{ type: String }],
    type: { type: String, enum: ['normal', 'repost', 'quote'], default: 'normal' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Creación de índices
PostSchema.index({ content: 'text' }); // Mantener índice de texto solo para content
// PostSchema.index({ tags: 1 }); // Índice estándar para tags
PostSchema.index({ communityId: 1, createdAt: -1 });
PostSchema.index({ creator: 1, createdAt: -1 });

export default mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);


/*
  Campo   	     Tipo normal   	Tipo repost   	Tipo quote
  _id         	     Sí	            Sí             	Sí
  creator	           Sí            	Sí            	Sí
  communityId	       Sí	            Sí	            Sí
  content	           Sí	            No             	Sí
  tags	             Sí	            No            	Sí
  likes       	     Sí            	No            	Sí
  repostedFrom	     No            	Sí            	No
  quotedPost  	     No            	No            	Sí
  media       	     Sí	            No            	Sí
  type         	     Sí            	Sí	            Sí
  comments     	     Sí            	No            	Sí
  views     	       Sí             No            	Sí
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
//   "views": 10,
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
//   "views": 15,
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
//   "views": 0,
//   "createdAt": {
//     "$date": "2024-11-12T23:59:58.429Z"
//   }
// }