import mongoose, { Schema, Document } from 'mongoose';

// Definimos la interfaz para el modelo
interface IEmailVerificationPin extends Document {
  email: string;
  pin: string;
  verified: boolean;
  createdAt: Date;
}

// Esquema del modelo
const EmailVerificationPinSchema = new Schema<IEmailVerificationPin>({
  email: {
    type: String,
    required: true,
    unique: false,
    trim: true,
    lowercase: true,
  },
  pin: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 6,
  },
  verified: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 1800,
  },
});

// Creación del modelo
const EmailVerificationPin = mongoose.models.EmailVerificationPin || mongoose.model<IEmailVerificationPin>('EmailVerificationPin', EmailVerificationPinSchema);

export default EmailVerificationPin;