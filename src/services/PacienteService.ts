import { Genero, Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import prisma from "../config/prisma";

export interface CriarPacienteDTO {
  nome: string;
  numero_identificacao: string;
  data_nascimento?: Date;
  genero?: Genero;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  historico_medico?: string;
  alergias?: string;
}

export interface AtualizarPacienteDTO {
  nome?: string;
  numero_identificacao?: string;
  data_nascimento?: Date;
  genero?: Genero;
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  historico_medico?: string;
  alergias?: string;
}

export class PacienteService {
  async criar(dados: CriarPacienteDTO) {
    // Verifica se o numero_identificacao já existe
    const pacienteExistente = await prisma.paciente.findUnique({
      where: { numero_identificacao: dados.numero_identificacao },
    });

    if (pacienteExistente) {
      throw new Error("Número de identificação já cadastrado");
    }

    try {
      // Cria automaticamente um usuário do tipo PACIENTE
      const emailGerado = `paciente_${dados.numero_identificacao.replace(/\D/g, "")}@farmacia.local`;
      const senhaHash = await bcrypt.hash(
        dados.numero_identificacao.replace(/\D/g, ""),
        10,
      );

      const resultado = await prisma.$transaction(async (tx) => {
        // Verifica se já existe um usuário com esse email
        const usuarioExistente = await tx.usuario.findUnique({
          where: { email: emailGerado },
        });

        let idUsuario: number;

        if (usuarioExistente) {
          idUsuario = usuarioExistente.id_usuario;

          // Verifica se esse usuário já tem paciente vinculado
          const pacienteDoUsuario = await tx.paciente.findFirst({
            where: { id_usuario: idUsuario },
          });
          if (pacienteDoUsuario) {
            throw new Error("Este usuário já possui um paciente vinculado");
          }
        } else {
          const novoUsuario = await tx.usuario.create({
            data: {
              nome: dados.nome,
              email: emailGerado,
              senha: senhaHash,
              tipo_usuario: "PACIENTE",
            },
          });
          idUsuario = novoUsuario.id_usuario;
        }

        // Cria o paciente vinculado ao usuário
        const paciente = await tx.paciente.create({
          data: {
            id_usuario: idUsuario,
            numero_identificacao: dados.numero_identificacao,
            data_nascimento: dados.data_nascimento,
            genero: dados.genero || "OUTRO",
            endereco: dados.endereco,
            cidade: dados.cidade,
            estado: dados.estado,
            cep: dados.cep,
            historico_medico: dados.historico_medico,
            alergias: dados.alergias,
          },
          include: {
            usuario: {
              select: {
                id_usuario: true,
                nome: true,
                email: true,
                telefone: true,
              },
            },
          },
        });

        return paciente;
      });

      return resultado;
    } catch (e: any) {
      if (
        e instanceof Prisma.PrismaClientKnownRequestError &&
        e.code === "P2002"
      ) {
        const campo = (e.meta?.target as string[])?.join(", ") || "campo único";
        throw new Error(`Valor duplicado no campo: ${campo}`);
      }
      throw e;
    }
  }

  async listar(skip = 0, take = 10) {
    const [dados, total] = await Promise.all([
      prisma.paciente.findMany({
        skip,
        take,
        orderBy: { id_paciente: "desc" },
        include: {
          usuario: {
            select: {
              id_usuario: true,
              nome: true,
              email: true,
              telefone: true,
            },
          },
        },
      }),
      prisma.paciente.count(),
    ]);

    return { dados, total, skip, take };
  }

  async obterPorId(id_paciente: number) {
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente },
      include: {
        usuario: {
          select: { id_usuario: true, nome: true, email: true, telefone: true },
        },
      },
    });

    if (!paciente) throw new Error("Paciente não encontrado");
    return paciente;
  }

  async atualizar(id_paciente: number, dados: AtualizarPacienteDTO) {
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente },
      include: { usuario: true },
    });
    if (!paciente) throw new Error("Paciente não encontrado");

    if (
      dados.numero_identificacao &&
      dados.numero_identificacao !== paciente.numero_identificacao
    ) {
      const existente = await prisma.paciente.findUnique({
        where: { numero_identificacao: dados.numero_identificacao },
      });
      if (existente && existente.id_paciente !== id_paciente) {
        throw new Error("Número de identificação já está em uso");
      }
    }

    // Atualiza o nome do usuário associado se fornecido
    if (dados.nome) {
      await prisma.usuario.update({
        where: { id_usuario: paciente.id_usuario },
        data: { nome: dados.nome },
      });
    }

    return await prisma.paciente.update({
      where: { id_paciente },
      data: {
        numero_identificacao: dados.numero_identificacao,
        data_nascimento: dados.data_nascimento,
        genero: dados.genero,
        endereco: dados.endereco,
        cidade: dados.cidade,
        estado: dados.estado,
        cep: dados.cep,
        historico_medico: dados.historico_medico,
        alergias: dados.alergias,
      },
      include: {
        usuario: {
          select: { id_usuario: true, nome: true, email: true, telefone: true },
        },
      },
    });
  }

  async excluir(id_paciente: number) {
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente },
    });
    if (!paciente) throw new Error("Paciente não encontrado");

    await prisma.paciente.delete({ where: { id_paciente } });
  }
}
