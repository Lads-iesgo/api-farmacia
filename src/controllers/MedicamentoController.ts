import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { MedicamentoService } from '../services/MedicamentoService';

const medicamentoService = new MedicamentoService();

export class MedicamentoController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const {
        nome_medicamento,
        principio_ativo,
        dosagem,
        apresentacao,
        fabricante,
        lote,
        data_validade,
        descricao,
        efeitos_colaterais,
      } = req.body;

      if (!nome_medicamento) {
        return res.status(400).json({
          erro: 'Nome do medicamento é obrigatório',
        });
      }

      const medicamento = await medicamentoService.criar({
        nome_medicamento,
        principio_ativo,
        dosagem,
        apresentacao,
        fabricante,
        lote,
        data_validade: data_validade ? new Date(data_validade) : undefined,
        descricao,
        efeitos_colaterais,
      });

      return res.status(201).json({
        mensagem: 'Medicamento criado com sucesso',
        medicamento,
      });
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao criar medicamento',
      });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const resultado = await medicamentoService.listar(skip, take);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao listar medicamentos',
      });
    }
  }

  async listarTodos(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const resultado = await medicamentoService.listarTodos(skip, take);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao listar medicamentos',
      });
    }
  }

  async obterPorId(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const medicamento = await medicamentoService.obterPorId(parseInt(id));

      return res.status(200).json(medicamento);
    } catch (error: any) {
      if (error.message === 'Medicamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao obter medicamento',
      });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const {
        nome_medicamento,
        principio_ativo,
        dosagem,
        apresentacao,
        fabricante,
        lote,
        data_validade,
        descricao,
        efeitos_colaterais,
        ativo,
      } = req.body;

      const medicamento = await medicamentoService.atualizar(parseInt(id), {
        nome_medicamento,
        principio_ativo,
        dosagem,
        apresentacao,
        fabricante,
        lote,
        data_validade: data_validade ? new Date(data_validade) : undefined,
        descricao,
        efeitos_colaterais,
        ativo,
      });

      return res.status(200).json({
        mensagem: 'Medicamento atualizado com sucesso',
        medicamento,
      });
    } catch (error: any) {
      if (error.message === 'Medicamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao atualizar medicamento',
      });
    }
  }

  async excluir(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await medicamentoService.excluir(parseInt(id));

      return res.status(200).json({
        mensagem: 'Medicamento marcado como inativo com sucesso',
      });
    } catch (error: any) {
      if (error.message === 'Medicamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao excluir medicamento',
      });
    }
  }

  async buscar(req: AuthRequest, res: Response) {
    try {
      const { termo } = req.query;

      if (!termo) {
        return res.status(400).json({
          erro: 'Termo de busca é obrigatório',
        });
      }

      const medicamentos = await medicamentoService.buscar(termo as string);

      return res.status(200).json(medicamentos);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao buscar medicamentos',
      });
    }
  }
}
