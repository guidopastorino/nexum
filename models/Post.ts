// Post contains EVERY feature, like: quoted post, reposted, normal post, if it is from a feed or a community..

import mongoose, { Schema, model, Types, Document } from 'mongoose';

interface PostDocument extends Document {
  creatorId: Types.ObjectId;
  communityId?: Types.ObjectId; // Asociar el post a una comunidad si aplica
  content: string;
  tags?: string[]; // Etiquetas generadas automáticamente
  likes: Types.ObjectId[];
  repostedFrom?: Types.ObjectId; // En caso de que sea un repost
  isQuote?: boolean; // Define si el post es un quote
  quotedPost?: Types.ObjectId; // Referencia al post quoteado
  media?: string[]; // Archivos adjuntos, URLs de multimedia
  type: 'normal' | 'repost' | 'quote';
  comments: Types.ObjectId[]; // Referencia a ids de comentarios (documentos)
  views: number;
}

const PostSchema = new Schema<PostDocument>(
  {
    creatorId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    communityId: { type: Schema.Types.ObjectId, ref: 'Community' }, // Comunidad opcional
    content: { type: String, required: true },
    tags: { type: [String], index: true }, // Etiquetas indexadas para búsquedas rápidas
    likes: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Usuarios que dieron like
    repostedFrom: { type: Schema.Types.ObjectId, ref: 'Post' }, // Referencia para repost
    isQuote: { type: Boolean, default: false }, // Marca si es un quote
    quotedPost: { type: Schema.Types.ObjectId, ref: 'Post' }, // Referencia al post quoteado
    media: [{ type: String }], // URLs de multimedia, como imágenes o videos
    type: { type: String, enum: ['normal', 'repost', 'quote'], default: 'normal' },
    comments: [{ type: Schema.Types.ObjectId, ref: 'Comment' }],
    views: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

// Índices adicionales
PostSchema.index({ content: 'text', tags: 1 });
PostSchema.index({ communityId: 1, createdAt: -1 }); // Para consultas de comunidad
PostSchema.index({ creatorId: 1, createdAt: -1 }); // Para consultas por usuario

export default mongoose.models.Post || mongoose.model<PostDocument>('Post', PostSchema);