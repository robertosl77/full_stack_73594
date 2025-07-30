// testmail.js
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config(); // Carga el .env

console.log("📦 SMTP config:");
console.log("HOST:", process.env.SMTP_HOST);
console.log("PORT:", process.env.SMTP_PORT);
console.log("USER:", process.env.SMTP_USER);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

const enviarEmail = async ({ to, subject, text }) => {
  try {
    const info = await transporter.sendMail({
      from: `"Responder - Integrador" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });

    console.log("📧 Email enviado con éxito. ID:", info.messageId);
  } catch (err) {
    console.error("❌ Error al enviar el email:", err);
  }
};

// Ejecutar prueba
enviarEmail({
  to: 'destinatario@gmail.com', // Cambiá esto por tu email real para probar
  subject: 'Prueba desde Node.js',
  text: 'Este es un correo de prueba enviado con Nodemailer y Gmail SMTP.'
});
