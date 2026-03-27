import prisma from '../config/prisma';
import { ValidationUtils } from '../utils/validation';

export interface CriarFarmaceuticoDTO {
  nome: string;
  email: string;
  telefone?: string;
  especialidade?: string;
}

export interface AtualizarFarmaceuticoDTO {
  nome?: string;
  email?: string;
  telefone?: string;
  especialidade?: string;
}

export class FarmaceuticoService {
  async criar(dados: CriarFarmaceuticoDTO) {
    // Valida email
    if (!ValidationUtils.isValidEmail(dados.email)) {
      throw new Error('Email inválido');
    }

    // Verifica se email já existe
    const farmaceuticoExistente = await prisma.farmaceutico.findUnique({
      where: { email: dados.email },
    });

    if (farmaceuticoExistente) {
      throw new Error('Email já cadastrado');
    }

    // Valida telefone se fornecido
    if (dados.telefone && !ValidationUtils.isValidPhone(dados.telefone)) {
      throw new Error('Telefone inválido');
    }

    const farmaceutico = await prisma.farmaceutico.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        telefone: dados.telefone,
        especialidade: dados.especialidade,
      },
    });

    return farmaceutico;
  }

  async listar(skip: number = 0, take: number = 10) {
    const farmaceuticos = await prisma.farmaceutico.findMany({
      where: { ativo: true },
      skip,
      take,
      include: {
        tratamentos: {
          select: {
            id_tratamento: true,
            paciente: { select: { usuario: { select: { nome: true } } } },
            medicamento: { select: { nome_medicamento: true } },
            status: true,
          },
        },
      },
      orderBy: { data_cadastro: 'desc' },
    });

    const total = await prisma.farmaceutico.count({ where: { ativo: true } });

    return { farmaceuticos, total };
  }

  async obterPorId(id_farmaceutico: number) {
    const farmaceutico = await prisma.farmaceutico.findUnique({
      where: { id_farmaceutico },
      include: {
        tratamentos: {
          include: {
            paciente: {
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
            },
            medicamento: true,
          },
        },
      },
    });

    if (!farmaceutico) {
      throw new Error('Farmacêutico não encontrado');
    }

    return farmaceutico;
  }

  async atualizar(id_farmaceutico: number, dados: AtualizarFarmaceuticoDTO) {
    const farmaceutico = await prisma.farmaceutico.findUnique({
      where: { id_farmaceutico },
    });

    if (!farmaceutico) {
      throw new Error('Farmacêutico não encontrado');
    }

    // Se está mudando o email, valida se já existe
    if (dados.email && dados.email !== farmaceutico.email) {
      const emailExistente = await prisma.farmaceutico.findUnique({
        where: { email: dados.email },
      });

      if (emailExistente) {
        throw new Error('Email já está em uso');
      }

      // Valida formato do email
      if (!ValidationUtils.isValidEmail(dados.email)) {
        throw new Error('Email inválido');
      }
    }

    // Valida telefone se fornecido
    if (dados.telefone && !ValidationUtils.isValidPhone(dados.telefone)) {
      throw new Error('Telefone inválido');
    }

    const farmaceuticoAtualizado = await prisma.farmaceutico.update({
      where: { id_farmaceutico },
      data: {
        nome: dados.nome || farmaceutico.nome,
        email: dados.email || farmaceutico.email,
        telefone: dados.telefone !== undefined ? dados.telefone : farmaceutico.telefone,
        especialidade: dados.especialidade !== undefined ? dados.especialidade : farmaceutico.especialidade,
      },
    });

    return farmaceuticoAtualizado;
  }

  async excluir(id_farmaceutico: number) {
    const farmaceutico = await prisma.farmaceutico.findUnique({
      where: { id_farmaceutico },
    });

    if (!farmaceutico) {
      throw new Error('Farmacêutico não encontrado');
    }

    // Verifica se tem tratamentos ativos associados
    const tratamentosAtivos = await prisma.tratamento.count({
      where: {
        id_farmaceutico,
        status: { in: ['ATIVO', 'PAUSADO'] },
      },
    });

    if (tratamentosAtivos > 0) {
      throw new Error('Não é possível excluir farmacêutico com tratamentos ativos. Finalize os tratamentos primeiro.');
    }

    // Excluir logicamente (soft delete)
    await prisma.farmaceutico.update({
      where: { id_farmaceutico },
      data: { ativo: false },
    });
  }

  async listarTodos() {
    const farmaceuticos = await prisma.farmaceutico.findMany({
      where: { ativo: true },
      select: {
        id_farmaceutico: true,
        nome: true,
        especialidade: true,
        email: true,
        telefone: true,
      },
      orderBy: { nome: 'asc' },
    });

    return farmaceuticos;
  }

  async buscar(termo: string) {
    const farmaceuticos = await prisma.farmaceutico.findMany({
      where: {
        ativo: true,
        OR: [
          { nome: { contains: termo } },
          { especialidade: { contains: termo } },
          { email: { contains: termo } },
        ],
      },
      select: {
        id_farmaceutico: true,
        nome: true,
        especialidade: true,
        email: true,
        telefone: true,
      },
    });

    return farmaceuticos;
  }
}
