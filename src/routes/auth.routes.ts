import { Router } from 'express';
import { AutenticacaoController } from '../controllers/AutenticacaoController';
import { autenticacao } from '../middleware/auth';

const router = Router();
const controller = new AutenticacaoController();

// Rotas públicas
router.post('/registrar', (req, res) => controller.registrar(req, res));
router.post('/signup', (req, res) => controller.registrar(req, res));
router.post('/login', (req, res) => controller.login(req, res));
router.post('/recuperar-senha', (req, res) => controller.solicitarRecuperacaoSenha(req, res));
router.post('/resetar-senha', (req, res) => controller.resetarSenha(req, res));

// Rota de redirecionamento: abre o deep link do app a partir de um link HTTP (contorna bloqueio de emails mobile)
router.get('/redirecionar-reset', (req, res) => {
  const { token } = req.query;

  if (!token || typeof token !== 'string') {
    return res.status(400).send('<h2>Link inválido ou expirado.</h2>');
  }

  const deepLink = `appfarmacia://redefinir-senha?token=${encodeURIComponent(token)}`;

  return res.status(200).send(`<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Redirecionando para o App...</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: Arial, sans-serif;
      background: #f0f4f8;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 20px;
    }
    .card {
      background: #fff;
      border-radius: 16px;
      padding: 40px 30px;
      max-width: 400px;
      width: 100%;
      text-align: center;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    h2 { color: #001F54; margin-bottom: 12px; }
    p { color: #555; font-size: 15px; line-height: 1.5; margin-bottom: 24px; }
    a.btn {
      display: inline-block;
      background: #001F54;
      color: #fff;
      text-decoration: none;
      padding: 14px 28px;
      border-radius: 10px;
      font-size: 15px;
      font-weight: bold;
    }
    .spinner {
      width: 36px; height: 36px;
      border: 4px solid #e2e8f0;
      border-top-color: #001F54;
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 20px;
    }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="card">
    <div class="spinner"></div>
    <h2>Abrindo o App...</h2>
    <p>Você será redirecionado automaticamente para redefinir sua senha.<br/>Se nada acontecer, toque no botão abaixo.</p>
    <a class="btn" href="${deepLink}">Abrir App e Redefinir Senha</a>
  </div>
  <script>
    // Redireciona automaticamente após 500ms
    setTimeout(function() {
      window.location.href = "${deepLink}";
    }, 500);
  </script>
</body>
</html>`);
});

// Rotas autenticadas
router.post('/alterar-senha', autenticacao, (req, res) => controller.alterarSenha(req, res));

export default router;
