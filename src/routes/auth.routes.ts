import { Router } from "express";
import { AutenticacaoController } from "../controllers/AutenticacaoController";
import { autenticacao } from "../middleware/auth";

const router = Router();
const controller = new AutenticacaoController();

// Rotas públicas
router.post("/registrar", (req, res) => controller.registrar(req, res));
router.post("/login", (req, res) => controller.login(req, res));
router.post("/recuperar-senha", (req, res) =>
  controller.solicitarRecuperacaoSenha(req, res),
);
router.post("/resetar-senha", (req, res) => controller.resetarSenha(req, res));

// Rotas autenticadas
router.post("/alterar-senha", autenticacao, (req, res) =>
  controller.alterarSenha(req, res),
);

export default router;
