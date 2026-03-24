import { Router } from 'express';
import { solicitarRecuperacaoSenha, redefinirSenhaUsuario } from './services/authService.js';

const router = Router();

// ==========================================
// ROTA 1: SOLICITAR RECUPERAÇÃO DE SENHA
// ==========================================
router.post('/esqueci-senha', async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'O e-mail é obrigatório.' });
  }

  try {
    // A rota só repassa a bola para o Service!
    await solicitarRecuperacaoSenha(email);
    
    return res.json({ message: 'E-mail de recuperação enviado com sucesso!' });
  } catch (error: any) {
    // Se for o erro do nosso Service dizendo que não achou, devolvemos 404
    if (error.message === 'Usuário não encontrado.') {
      return res.status(404).json({ error: error.message });
    }
    
    // Se der erro no servidor/e-mail, devolvemos 500
    console.error('Erro na solicitação:', error);
    return res.status(500).json({ error: 'Erro interno ao processar a solicitação.' });
  }
});

// ==========================================
// ROTA 2: REDEFINIR A SENHA
// ==========================================
router.post('/redefinir-senha', async (req, res) => {
  const { token, novaSenha } = req.body;

  if (!token || !novaSenha) {
    return res.status(400).json({ error: 'Token e nova senha são obrigatórios.' });
  }

  try {
    // Passa o token e a senha para o Service validar e salvar
    await redefinirSenhaUsuario(token, novaSenha);
    
    return res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error: any) {
    // Se o token for inválido ou estiver expirado, o Service avisa e nós devolvemos 400
    if (error.message.includes('Token') || error.message.includes('expirou')) {
      return res.status(400).json({ error: error.message });
    }
    
    // Se for um erro inesperado do servidor, devolvemos 500
    console.error('Erro na redefinição:', error);
    return res.status(500).json({ error: 'Erro interno ao redefinir a senha.' });
  }
});

export default router;