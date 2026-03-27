import { Router } from 'express';
import { TratamentoController } from '../controllers/TratamentoController';
import { autenticacao } from '../middleware/auth';

const router = Router();
const controller = new TratamentoController();

// Todas as rotas de tratamentos requerem autenticação
router.use(autenticacao);

router.post('/', (req, res) => controller.criar(req, res));
router.get('/', (req, res) => controller.listar(req, res));
router.get('/estatisticas/resume', (req, res) => controller.obterEstatisticas(req, res));
router.get('/paciente/:id_paciente', (req, res) => controller.listarPorPaciente(req, res));
router.get('/:id', (req, res) => controller.obterPorId(req, res));
router.put('/:id', (req, res) => controller.atualizar(req, res));
router.delete('/:id', (req, res) => controller.excluir(req, res));
router.patch('/:id/finalizar', (req, res) => controller.finalizar(req, res));
router.patch('/:id/pausar', (req, res) => controller.pausar(req, res));
router.patch('/:id/retomar', (req, res) => controller.retomar(req, res));

export default router;
