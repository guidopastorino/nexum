// app/api/send-pin/route.ts

import nodemailer from 'nodemailer';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import EmailVerificationPin from '@/models/EmailVerificationPin';

export async function POST(req: Request) {
  const { email } = await req.json();

  console.log({email})

  if (!email) {
    return NextResponse.json({ error: 'Email is required' }, { status: 400 });
  }

  // Generar un PIN aleatorio de 6 dígitos
  const pin = crypto.randomInt(100000, 999999).toString();

  // Configurar el servicio de correo
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.ACCOUNT_APP_EMAIL,
      pass: process.env.ACCOUNT_APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.ACCOUNT_APP_EMAIL,
    to: email,
    subject: 'Código de verificación',
    html: `<p>Tu código de verificación es: <strong>${pin}</strong></p><p>Este código expirará en 15 minutos.</p>`,
  };

  const newEmailVerificationPin = new EmailVerificationPin({ email, pin });

  try {
    await newEmailVerificationPin.save()
    await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'PIN enviado a tu correo' }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo:', error);
    return NextResponse.json({ error: 'Hubo un problema al enviar el correo' }, { status: 500 });
  }
}
