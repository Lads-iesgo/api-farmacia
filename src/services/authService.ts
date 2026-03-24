import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { enviarEmailRecuperacao } from './emailService.js';

const prisma = new PrismaClient();

// =======================================================
// 1. LÓGICA DE SOLICITAR RECUPERAÇÃO (ESQUECI A SENHA)
// =======================================================
export async function solicitarRecuperacaoSenha(email: string) {
  const usuario = await prisma.usuarios.findUnique({
    where: { email },
  });

  if (!usuario) {
    throw new Error('Usuário não encontrado.');
  }

  // 1. Gera o token ORIGINAL (esse vai pro e-mail do cliente)
  const tokenOriginal = crypto.randomBytes(32).toString('hex');
  
  // 2. Cria o HASH de segurança (esse vai pro Banco de Dados)
  const tokenHash = crypto.createHash('sha256').update(tokenOriginal).digest('hex');

  const expiraEm = new Date();
  expiraEm.setMinutes(expiraEm.getMinutes() + 30);

  // 3. Salva o HASH no banco (Atenção aqui: passamos a variável tokenHash)
  await prisma.tokens_recuperacao.create({
    data: {
      id_usuario: usuario.id_usuario,
      token: tokenHash, 
      expira_em: expiraEm,
    },
  });

  // 4. Dispara o e-mail enviando o token ORIGINAL
  await enviarEmailRecuperacao(email, tokenOriginal);
}

// =======================================================
// 2. LÓGICA DE SALVAR A NOVA SENHA (REDEFINIR SENHA)
// =======================================================
export async function redefinirSenhaUsuario(tokenRecebido: string, novaSenha: string) {
  // 1. Transforma o token recebido em Hash
  const tokenHash = crypto.createHash('sha256').update(tokenRecebido).digest('hex');

  // 2. Procuramos pelo Hash no banco
  const registroToken = await prisma.tokens_recuperacao.findFirst({
    where: { token: tokenHash }
  });

  if (!registroToken) {
    throw new Error('Token inválido ou não encontrado.');
  }

  // 3. VERIFICAÇÃO INTELIGENTE: Se 'usado_em' tem alguma data, já era!
  if (registroToken.usado_em !== null) {
    throw new Error('Este link de recuperação já foi utilizado.');
  }

  // 4. Verificamos se o token já expirou
  const agora = new Date();
  if (registroToken.expira_em < agora) {
    throw new Error('O link expirou. Solicite a recuperação novamente.');
  }

  // 5. Criptografamos a nova senha
  const salt = await bcrypt.genSalt(10);
  const senhaCriptografada = await bcrypt.hash(novaSenha, salt);

  // 6. Atualizamos a senha do usuário
  await prisma.usuarios.update({
    where: { id_usuario: registroToken.id_usuario },
    data: { senha: senhaCriptografada }
  });

  // 7. AUDITORIA MÁXIMA: Carimba a data e hora exata do uso!
  await prisma.tokens_recuperacao.updateMany({
    where: { token: tokenHash },
    data: { usado_em: new Date() } // <-- Carimbo de tempo aqui!
  });
}