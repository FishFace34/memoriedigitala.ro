import nodemailer from 'nodemailer';

function getTransporter() {
  const port = Number(process.env.SMTP_PORT || 465);
  const secure = port === 465; // 465 = SSL, 587 = STARTTLS
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

export async function sendOrderConfirmationEmail(
  email: string,
  name: string,
  eventId: string,
  accessKey: string,
  adminUrl: string,
  eventUrl: string
) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: 'Comanda ta MemorieDigitala.ro a fost confirmată!',
    html: `
      <h2>Bună ${name}!</h2>
      <p>Comanda ta a fost confirmată cu succes. Iată detaliile evenimentului tău:</p>
      
      <h3>Link pentru administrare:</h3>
      <p><a href="${adminUrl}">${adminUrl}</a></p>
      <p>Folosește acest link pentru a-ți gestiona evenimentul și pentru a descărca conținutul.</p>
      
      <h3>Link pentru invitați:</h3>
      <p><a href="${eventUrl}">${eventUrl}</a></p>
      <p>Distribuie acest link sau QR codul generat invitaților tăi pentru a încărca foto și video.</p>
      
      <h3>QR Code:</h3>
      <p>Îți vom genera un QR code unic în panoul de administrare.</p>
      
      <p>Mulțumim că ai ales MemorieDigitala.ro!</p>
      
      <p>Echipa MemorieDigitala.ro</p>
    `,
  };

  try {
    console.log('Attempting to send email to:', email);
    console.log('SMTP Config:', {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: process.env.SMTP_PORT === '465',
      user: process.env.SMTP_USER
    });
    await getTransporter().sendMail(mailOptions);
    console.log('Email sent successfully to:', email);
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    console.error('SMTP Error details:', error);
    return false;
  }
}


export async function sendPasswordResetEmail(
  email: string,
  name: string,
  resetUrl: string
) {
  const mailOptions = {
    from: process.env.FROM_EMAIL || process.env.SMTP_USER,
    to: email,
    subject: 'Reset your MemorieDigitala.ro password',
    html: `
      <h2>Hi ${name},</h2>
      <p>You requested to reset your password. Click the button below to set a new password. This link expires in 30 minutes.</p>
      <p><a href="${resetUrl}" style="background:#1d4ed8;color:#fff;padding:10px 16px;border-radius:8px;text-decoration:none;">Reset Password</a></p>
      <p>If you did not request this, you can ignore this email.</p>
    `,
    text: `Hi ${name},\n\nReset your password using the link below (valid for 30 minutes):\n${resetUrl}\n\nIf you did not request this, you can ignore this email.`,
  };

  try {
    await getTransporter().sendMail(mailOptions);
    return true;
  } catch (e) {
    console.error('Failed to send password reset email', e);
    return false;
  }
}


