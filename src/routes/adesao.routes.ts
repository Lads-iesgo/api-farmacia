import { Router } from 'express';
import { AdesaoController } from '../controllers/AdesaoController';
import { autenticacao } from '../middleware/auth';

const router = Router();
const controller = new AdesaoController();

// Todas as rotas de adesões requerem autenticação
router.use(autenticacao);

router.post('/', (req, res) => controller.criar(req, res));
router.get('/', (req, res) => controller.listar(req, res));
router.get('/estatisticas/resume', (req, res) => controller.obterEstatisticas(req, res));
router.get('/paciente/:id_paciente', (req, res) => controller.listarPorPaciente(req, res));
router.get('/:id', (req, res) => controller.obterPorId(req, res));
router.put('/:id', (req, res) => controller.atualizar(req, res));
router.patch('/:id/marcar-tomado', (req, res) => controller.marcarComoTomado(req, res));

export default router;
