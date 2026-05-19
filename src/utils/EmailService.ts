import nodemailer from 'nodemailer';

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async enviarEmailRecuperacaoSenha(para: string, link: string) {
    try {
      await this.transporter.sendMail({
        from: `"Farmácia APP" <${process.env.SMTP_FROM}>`,
        to: para,
        subject: 'Recuperação de Senha',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Recuperação de Senha</h2>
            <p>Você solicitou a recuperação de senha.</p>
            <p>Clique no link abaixo para criar uma nova senha:</p>
            <p>
              <a href="${link}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                Resetar minha senha
              </a>
            </p>
            <p>Ou copie e cole o link no seu navegador:</p>
            <p>${link}</p>
            <p>Este link expira em ${process.env.RESET_TOKEN_EXPIRES_IN || 1} hora(s).</p>
            <p>Se você não solicitou isso, ignore este email.</p>
          </div>
        `,
      });
      console.log('Email de recuperação enviado para:', para);
    } catch (error) {
      console.error('Erro ao enviar email de recuperação:', error);
      throw new Error('Não foi possível enviar o email de recuperação. Verifique as configurações (Senha de App).');
    }
  }
}

export default new EmailService();
