import { Router } from 'express';
import { MedicamentoController } from '../controllers/MedicamentoController';
import { autenticacao } from '../middleware/auth';

const router = Router();
const controller = new MedicamentoController();

// Todas as rotas de medicamentos requerem autenticação
router.use(autenticacao);

router.post('/', (req, res) => controller.criar(req, res));
router.get('/', (req, res) => controller.listar(req, res));
router.get('/todos', (req, res) => controller.listarTodos(req, res));
router.get('/buscar', (req, res) => controller.buscar(req, res));
router.get('/:id', (req, res) => controller.obterPorId(req, res));
router.put('/:id', (req, res) => controller.atualizar(req, res));
router.delete('/:id', (req, res) => controller.excluir(req, res));

export default router;
