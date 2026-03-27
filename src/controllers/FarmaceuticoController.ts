import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { FarmaceuticoService } from "../services/FarmaceuticoService";

const farmaceuticoService = new FarmaceuticoService();

export class FarmaceuticoController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const { nome, email, telefone, especialidade } = req.body;

      if (!nome || !email) {
        return res.status(400).json({
          erro: "nome e email são obrigatórios",
        });
      }

      const farmaceutico = await farmaceuticoService.criar({
        nome,
        email,
        telefone,
        especialidade,
      });

      return res.status(201).json({
        mensagem: "Farmacêutico criado com sucesso",
        farmaceutico,
      });
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao criar farmacêutico",
      });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;

      const resultado = await farmaceuticoService.listar(skip, take);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao listar farmacêuticos",
      });
    }
  }

  async listarTodos(req: AuthRequest, res: Response) {
    try {
      const farmaceuticos = await farmaceuticoService.listarTodos();

      return res.status(200).json(farmaceuticos);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao listar farmacêuticos",
      });
    }
  }

  async buscar(req: AuthRequest, res: Response) {
    try {
      const { termo } = req.query;

      if (!termo) {
        return res.status(400).json({
          erro: "termo é obrigatório",
        });
      }

      const farmaceuticos = await farmaceuticoService.buscar(termo as string);

      return res.status(200).json(farmaceuticos);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || "Erro ao buscar farmacêuticos",
      });
    }
  }

  async obterPorId(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      const farmaceutico = await farmaceuticoService.obterPorId(parseInt(id));

      return res.status(200).json(farmaceutico);
    } catch (error: any) {
      if (error.message === "Farmacêutico não encontrado") {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || "Erro ao obter farmacêutico",
      });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, especialidade } = req.body;

      const farmaceutico = await farmaceuticoService.atualizar(parseInt(id), {
        nome,
        email,
        telefone,
        especialidade,
      });

      return res.status(200).json({
        mensagem: "Farmacêutico atualizado com sucesso",
        farmaceutico,
      });
    } catch (error: any) {
      if (error.message === "Farmacêutico não encontrado") {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || "Erro ao atualizar farmacêutico",
      });
    }
  }

  async excluir(req: AuthRequest, res: Response) {
    try {
      const { id } = req.params;

      await farmaceuticoService.excluir(parseInt(id));

      return res.status(200).json({
        mensagem: "Farmacêutico excluído com sucesso",
      });
    } catch (error: any) {
      if (error.message === "Farmacêutico não encontrado") {
        return res.status(404).json({ erro: error.message });
      }

      return res.status(400).json({
        erro: error.message || "Erro ao excluir farmacêutico",
      });
    }
  }
}
