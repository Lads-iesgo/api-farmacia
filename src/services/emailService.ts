import nodemailer from 'nodemailer';

// Cria o "carteiro" usando as variáveis do seu .env
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function enviarEmailRecuperacao(emailDestino: string, token: string) {
  const baseUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  const linkRecuperacao = `${baseUrl}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: '"Sistema Farmácia IESGO" <nao-responda@iesgo.edu.br>',
      to: emailDestino,
      subject: 'Recuperação de Senha',
      html: `
        <!DOCTYPE html>
        <html lang="pt-BR">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Recuperação de Senha</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333333;">
          <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #f4f7f6; padding: 40px 15px;">
            <tr>
              <td align="center">
                <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
                  
                  <tr>
                    <td align="center" style="background-color: #002D62; padding: 30px 20px;">
                      <h2 style="color: #ffffff; margin: 0; font-size: 24px; letter-spacing: 1px;">Farmácia IESGO</h2>
                    </td>
                  </tr>
                  
                  <tr>
                    <td style="padding: 40px 30px;">
                      <h3 style="margin-top: 0; color: #002D62; font-size: 20px;">Redefinição de Senha</h3>
                      <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 20px;">Olá,</p>
                      <p style="font-size: 16px; line-height: 1.6; color: #555555; margin-bottom: 25px;">
                        Recebemos uma solicitação para redefinir a senha da sua conta no sistema da <strong>Farmácia IESGO</strong>. 
                        Se foi você, clique no botão abaixo para criar uma nova senha.
                      </p>
                      
                      <table width="100%" border="0" cellspacing="0" cellpadding="0">
                        <tr>
                          <td align="center" style="padding: 20px 0;">
                            <a href="${linkRecuperacao}" style="background-color: #002D62; color: #ffffff; text-decoration: none; padding: 14px 35px; border-radius: 6px; font-size: 16px; font-weight: bold; display: inline-block;">
                              Redefinir Minha Senha
                            </a>
                          </td>
                        </tr>
                      </table>
                      
                      <p style="font-size: 14px; line-height: 1.6; color: #e74c3c; margin-top: 15px; margin-bottom: 30px; text-align: center;">
                        <strong>⚠️ Atenção:</strong> Este link expira em 30 minutos.
                      </p>
                      
                      <hr style="border: none; border-top: 1px solid #eeeeee; margin: 30px 0;">
                      
                      <p style="font-size: 14px; line-height: 1.6; color: #888888; margin: 0;">
                        Se você não solicitou a redefinição de senha, por favor, ignore este e-mail. Sua conta continuará segura.
                      </p>
                    </td>
                  </tr>
                  
                  <tr>
                    <td align="center" style="background-color: #f9f9f9; padding: 20px; border-top: 1px solid #eeeeee;">
                      <p style="font-size: 12px; color: #999999; margin: 0;">
                        &copy; ${new Date().getFullYear()} Farmácia IESGO. Todos os direitos reservados.
                      </p>
                    </td>
                  </tr>
                  
                </table>
              </td>
            </tr>
          </table>
        </body>
        </html>
      `,
    });
  } catch (error) {
    throw new Error('Falha no envio do e-mail.');
  }
}