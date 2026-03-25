import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { TratamentoService } from '../services/TratamentoService';

const tratamentoService = new TratamentoService();

export class TratamentoController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const {
        id_paciente,
        id_medicamento,
        id_usuario_criador,
        data_inicio,
        data_fim,
        frequencia,
        dosagem_prescrita,
        motivo_tratamento,
        instrucoes_especiais,
      } = req.body;

      if (!id_paciente || !id_medicamento || !id_usuario_criador || !data_inicio || !frequencia) {
        return res.status(400).json({
          erro: 'id_paciente, id_medicamento, id_usuario_criador, data_inicio e frequencia são obrigatórios',
        });
      }

      const tratamento = await tratamentoService.criar({
        id_paciente,
        id_medicamento,
        id_usuario_criador,
        data_inicio: new Date(data_inicio),
        data_fim: data_fim ? new Date(data_fim) : undefined,
        frequencia,
        dosagem_prescrita,
        motivo_tratamento,
        instrucoes_especiais,
      });

      return res.status(201).json({
        mensagem: 'Tratamento criado com sucesso',
        tratamento,
      });
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao criar tratamento',
      });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const resultado = await tratamentoService.listar(skip, take);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao listar tratamentos',
      });
    }
  }

  async listarPorPaciente(req: AuthRequest, res: Response) {
    try {
      const { id_paciente } = req.params;

      const tratamentos = await tratamentoService.listarPorPaciente(parseInt(id_paciente));

      return res.status(200).json(tratamentos);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao listar tratamentos',
      });
    }
  }

  async obterPorId(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const tratamento = await tratamentoService.obterPorId(parseInt(id));

      return res.status(200).json(tratamento);
    } catch (error: any) {
      if (error.message === 'Tratamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao obter tratamento',
      });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { data_fim, frequencia, dosagem_prescrita, motivo_tratamento, instrucoes_especiais, status } = req.body;

      const tratamento = await tratamentoService.atualizar(parseInt(id), {
        data_fim: data_fim ? new Date(data_fim) : undefined,
        frequencia,
        dosagem_prescrita,
        motivo_tratamento,
        instrucoes_especiais,
        status,
      });

      return res.status(200).json({
        mensagem: 'Tratamento atualizado com sucesso',
        tratamento,
      });
    } catch (error: any) {
      if (error.message === 'Tratamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao atualizar tratamento',
      });
    }
  }

  async excluir(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await tratamentoService.excluir(parseInt(id));

      return res.status(200).json({
        mensagem: 'Tratamento excluído com sucesso',
      });
    } catch (error: any) {
      if (error.message === 'Tratamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao excluir tratamento',
      });
    }
  }

  async finalizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const tratamento = await tratamentoService.finalizarTratamento(parseInt(id));

      return res.status(200).json({
        mensagem: 'Tratamento finalizado com sucesso',
        tratamento,
      });
    } catch (error: any) {
      if (error.message === 'Tratamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao finalizar tratamento',
      });
    }
  }

  async pausar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const tratamento = await tratamentoService.pausarTratamento(parseInt(id));

      return res.status(200).json({
        mensagem: 'Tratamento pausado com sucesso',
        tratamento,
      });
    } catch (error: any) {
      if (error.message === 'Tratamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao pausar tratamento',
      });
    }
  }

  async retomar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const tratamento = await tratamentoService.retomarTratamento(parseInt(id));

      return res.status(200).json({
        mensagem: 'Tratamento retomado com sucesso',
        tratamento,
      });
    } catch (error: any) {
      if (error.message === 'Tratamento não encontrado') {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || 'Erro ao retomar tratamento',
      });
    }
  }

  async obterEstatisticas(req: AuthRequest, res: Response) {
    try {
      const estatisticas = await tratamentoService.obterEstatisticas();

      return res.status(200).json(estatisticas);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao obter estatísticas',
      });
    }
  }
}
