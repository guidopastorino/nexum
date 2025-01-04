import mongoose, { Schema, Document, Types } from 'mongoose';
import { nanoid } from 'nanoid';

// Interfaz para el documento Feed
interface IFeed extends Document {
  creator: Types.ObjectId; // ID del creador del feed (usuario)
  picture: string; // Imagen del feed
  title: string; // Título del feed
  description: string; // Descripción del feed
  privacy: 'public' | 'private'; // Configuración de privacidad del feed
  likes: Types.ObjectId[]; // Referencias a usuarios que dieron like
  posts: Types.ObjectId[]; // IDs de los posts en el feed
  maskedId: string; // Id para las rutas del cliente
}

// Esquema de Feed
const FeedSchema = new Schema<IFeed>(
  {
    creator: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    }, // Usuario que creó el feed
    picture: {
      type: String,
    }, // URL de la imagen del feed, con valor predeterminado null
    title: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      maxlength: 100, // Máximo de 100 caracteres para el título
    }, // Título del feed
    description: {
      type: String,
      required: true,
      maxlength: 500, // Descripción del feed con un máximo de 500 caracteres
    }, // Descripción
    privacy: {
      type: String,
      enum: ['public', 'private'],
      required: true,
      default: 'public',
    }, // Configuración de privacidad
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ], // Referencias a usuarios que dieron like
    posts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ], // Referencias a posts incluidos en el feed
    maskedId: { type: String, unique: true, required: true, default: () => nanoid(10) }
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

// Index para mejorar las consultas de feeds públicos y privados
FeedSchema.index({ privacy: 1, creator: 1 });

// Exporta el modelo
const FeedModel = mongoose.models.Feed || mongoose.model<IFeed>('Feed', FeedSchema);

export default FeedModel;