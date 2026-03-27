import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { AdesaoService } from "../services/AdesaoService";

const adesaoService = new AdesaoService();

export class AdesaoController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const { id_tratamento, id_paciente, data_prevista, data_tomada, status } =
        req.body;

      if (!id_tratamento || !id_paciente || !data_prevista) {
        return res.status(400).json({
          erro: "id_tratamento, id_paciente e data_prevista são obrigatórios",
        });
      }

      const adesao = await adesaoService.criar({
        id_tratamento,
        id_paciente,
        data_prevista: new Date(data_prevista),
        data_tomada: data_tomada ? new Date(data_tomada) : undefined,
        status: status,
      });

      return res.status(201).json({
        mensagem: "Adesão criada com sucesso",
        adesao,
      });
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao criar adesão",
      });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const resultado = await adesaoService.listar(skip, take);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao listar adesões",
      });
    }
  }

  async listarPorPaciente(req: AuthRequest, res: Response) {
    try {
      const { id_paciente } = req.params;
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const resultado = await adesaoService.listarPorPaciente(
        parseInt(id_paciente),
        skip,
        take,
      );

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao listar adesões",
      });
    }
  }

  async obterPorId(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const adesao = await adesaoService.obterPorId(parseInt(id));

      return res.status(200).json(adesao);
    } catch (error: any) {
      if (error.message === "Adesão não encontrada") {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || "Erro ao obter adesão",
      });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { data_tomada, status, observacoes } = req.body;

      const adesao = await adesaoService.atualizar(parseInt(id), {
        data_tomada: data_tomada ? new Date(data_tomada) : undefined,
        status,
        observacoes,
      });

      return res.status(200).json({
        mensagem: "Adesão atualizada com sucesso",
        adesao,
      });
    } catch (error: any) {
      if (error.message === "Adesão não encontrada") {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || "Erro ao atualizar adesão",
      });
    }
  }

  async marcarComoTomado(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const adesao = await adesaoService.marcarComoTomado(parseInt(id));

      return res.status(200).json({
        mensagem: "Medicamento marcado como tomado",
        adesao,
      });
    } catch (error: any) {
      if (error.message === "Adesão não encontrada") {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || "Erro ao marcar como tomado",
      });
    }
  }

  async obterEstatisticas(req: AuthRequest, res: Response) {
    try {
      const id_paciente = req.query.id_paciente
        ? parseInt(req.query.id_paciente as string)
        : undefined;

      const estatisticas = await adesaoService.obterEstatisticas(id_paciente);

      return res.status(200).json(estatisticas);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao obter estatísticas",
      });
    }
  }

  async excluir(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await adesaoService.excluir(parseInt(id));

      return res.status(200).json({
        mensagem: "Adesão excluída com sucesso",
      });
    } catch (error: any) {
      if (error.message === "Adesão não encontrada") {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || "Erro ao excluir adesão",
      });
    }
  }
}
