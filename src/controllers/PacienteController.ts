import { Response } from "express";
import { AuthRequest } from "../middleware/auth";
import { PacienteService } from "../services/PacienteService";

const pacienteService = new PacienteService();

export class PacienteController {
  async criar(req: AuthRequest, res: Response) {
    try {
      const {
        nome,
        numero_identificacao,
        data_nascimento,
        genero,
        endereco,
        cidade,
        estado,
        cep,
        historico_medico,
        alergias,
      } = req.body;

      if (!nome || !numero_identificacao) {
        return res.status(400).json({
          erro: "nome e numero_identificacao são obrigatórios",
        });
      }

      const paciente = await pacienteService.criar({
        nome,
        numero_identificacao,
        data_nascimento: data_nascimento
          ? new Date(data_nascimento)
          : undefined,
        genero,
        endereco,
        cidade,
        estado,
        cep,
        historico_medico,
        alergias,
      });

      return res
        .status(201)
        .json({ mensagem: "Paciente criado com sucesso", paciente });
    } catch (error: any) {
      return res
        .status(400)
        .json({ erro: error.message || "Erro ao criar paciente" });
    }
  }

  async listar(req: AuthRequest, res: Response) {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const take = parseInt(req.query.take as string) || 10;
      const resultado = await pacienteService.listar(skip, take);
      return res.status(200).json(resultado);
    } catch (error: any) {
      return res
        .status(400)
        .json({ erro: error.message || "Erro ao listar pacientes" });
    }
  }

  async obterPorId(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        return res.status(400).json({ erro: "ID inválido" });

      const paciente = await pacienteService.obterPorId(id);
      return res.status(200).json(paciente);
    } catch (error: any) {
      if (error.message === "Paciente não encontrado") {
        return res.status(404).json({ erro: error.message });
      }
      return res
        .status(400)
        .json({ erro: error.message || "Erro ao obter paciente" });
    }
  }

  async atualizar(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        return res.status(400).json({ erro: "ID inválido" });

      const {
        nome,
        numero_identificacao,
        data_nascimento,
        genero,
        endereco,
        cidade,
        estado,
        cep,
        historico_medico,
        alergias,
      } = req.body;

      const paciente = await pacienteService.atualizar(id, {
        nome,
        numero_identificacao,
        data_nascimento: data_nascimento
          ? new Date(data_nascimento)
          : undefined,
        genero,
        endereco,
        cidade,
        estado,
        cep,
        historico_medico,
        alergias,
      });

      return res
        .status(200)
        .json({ mensagem: "Paciente atualizado com sucesso", paciente });
    } catch (error: any) {
      if (error.message === "Paciente não encontrado") {
        return res.status(404).json({ erro: error.message });
      }
      return res
        .status(400)
        .json({ erro: error.message || "Erro ao atualizar paciente" });
    }
  }

  async excluir(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id))
        return res.status(400).json({ erro: "ID inválido" });

      await pacienteService.excluir(id);
      return res
        .status(200)
        .json({ mensagem: "Paciente excluído com sucesso" });
    } catch (error: any) {
      if (error.message === "Paciente não encontrado") {
        return res.status(404).json({ erro: error.message });
      }
      return res
        .status(400)
        .json({ erro: error.message || "Erro ao excluir paciente" });
    }
  }
}
