import dotenv from 'dotenv';
import nodemailer from 'nodemailer';

dotenv.config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,         // smtp.gmail.com
  port: Number(process.env.SMTP_PORT), // 465
  secure: true,                        // true para puerto 465 (SSL)
  auth: {
    user: process.env.SMTP_USER,       // sr.macros@gmail.com
    pass: process.env.SMTP_PASS        // contraseña de aplicación
  }
});

export const enviarEmail = async ({ to, subject, text }) => {

  console.log("📦 SMTP config:");
  console.log("HOST:", process.env.SMTP_HOST);
  console.log("PORT:", process.env.SMTP_PORT);
  console.log("USER:", process.env.SMTP_USER);  
  console.log("TRANSPORTER:", transporter);  

  try {
    const info = await transporter.sendMail({
      from: `"Responder - Integrador" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text
    });

    console.log("📧 Email enviado:", info.messageId);

  } catch (err) {
    console.error("❌ Error al enviar con nodemailer:", err);
    throw err;
  }
};
