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
  content	           Sí	            Sí             	Sí
  tags	             Sí	            Sí            	Sí
  likes       	     Sí            	Sí            	Sí
  repostedFrom	     No            	Sí            	No
  quotedPost  	     No            	No            	Sí
  media       	     Sí	            Sí            	Sí
  type         	     Sí            	Sí	            Sí
  comments     	     Sí            	Sí            	Sí
  views     	       Sí            	Sí            	Sí
*/