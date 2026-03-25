import { Router } from 'express';
import { PacienteController } from '../controllers/PacienteController';
import { autenticacao } from '../middleware/auth';

const router = Router();
const controller = new PacienteController();

// Todas as rotas de pacientes requerem autenticação
router.use(autenticacao);

router.post('/', (req, res) => controller.criar(req, res));
router.get('/', (req, res) => controller.listar(req, res));
router.get('/:id', (req, res) => controller.obterPorId(req, res));
router.put('/:id', (req, res) => controller.atualizar(req, res));
router.delete('/:id', (req, res) => controller.excluir(req, res));

export default router;
