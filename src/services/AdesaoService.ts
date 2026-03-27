import prisma from "../config/prisma";

export interface CriarAdesaoDTO {
  id_tratamento: number;
  id_paciente: number;
  data_prevista: Date;
  data_tomada?: Date;
  status?: "PENDENTE" | "TOMADO" | "PERDIDO" | "ADIADO";
}

export interface AtualizarAdesaoDTO {
  data_tomada?: Date;
  status?: "PENDENTE" | "TOMADO" | "PERDIDO" | "ADIADO";
  observacoes?: string;
}

export class AdesaoService {
  async criar(dados: CriarAdesaoDTO) {
    // Verifica se tratamento existe
    const tratamento = await prisma.tratamento.findUnique({
      where: { id_tratamento: dados.id_tratamento },
    });

    if (!tratamento) {
      throw new Error("Tratamento não encontrado");
    }

    // Verifica se paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente: dados.id_paciente },
    });

    if (!paciente) {
      throw new Error("Paciente não encontrado");
    }

    return await prisma.adesaoMedicamento.create({
      data: {
        id_tratamento: dados.id_tratamento,
        id_paciente: dados.id_paciente,
        data_prevista: dados.data_prevista,
        data_tomada: dados.data_tomada,
        status: dados.status || (dados.data_tomada ? "TOMADO" : "PENDENTE"),
      },
      include: {
        tratamento: {
          include: { medicamento: true },
        },
        paciente: {
          select: {
            usuario: { select: { nome: true, email: true } },
          },
        },
      },
    });
  }

  async listar(skip: number = 0, take: number = 10) {
    const adesoes = await prisma.adesaoMedicamento.findMany({
      skip,
      take,
      include: {
        tratamento: {
          include: { medicamento: true },
        },
        paciente: {
          select: {
            usuario: { select: { nome: true, email: true } },
          },
        },
      },
      orderBy: { data_prevista: "desc" },
    });

    const total = await prisma.adesaoMedicamento.count();

    return { adesoes, total };
  }

  async listarPorPaciente(
    id_paciente: number,
    skip: number = 0,
    take: number = 10,
  ) {
    const adesoes = await prisma.adesaoMedicamento.findMany({
      where: { id_paciente },
      skip,
      take,
      include: {
        tratamento: {
          include: { medicamento: true },
        },
      },
      orderBy: { data_prevista: "desc" },
    });

    const total = await prisma.adesaoMedicamento.count({
      where: { id_paciente },
    });

    return { adesoes, total };
  }

  async obterPorId(id_adesao: number) {
    const adesao = await prisma.adesaoMedicamento.findUnique({
      where: { id_adesao },
      include: {
        tratamento: {
          include: {
            medicamento: true,
            paciente: {
              select: {
                usuario: { select: { nome: true, email: true } },
              },
            },
          },
        },
      },
    });

    if (!adesao) {
      throw new Error("Adesão não encontrada");
    }

    return adesao;
  }

  async atualizar(id_adesao: number, dados: AtualizarAdesaoDTO) {
    const adesao = await prisma.adesaoMedicamento.findUnique({
      where: { id_adesao },
    });

    if (!adesao) {
      throw new Error("Adesão não encontrada");
    }

    return await prisma.adesaoMedicamento.update({
      where: { id_adesao },
      data: {
        data_tomada: dados.data_tomada,
        status: dados.status,
        observacoes: dados.observacoes,
      },
      include: {
        tratamento: {
          include: { medicamento: true },
        },
      },
    });
  }

  async marcarComoTomado(id_adesao: number) {
    return await prisma.adesaoMedicamento.update({
      where: { id_adesao },
      data: {
        status: "TOMADO",
        data_tomada: new Date(),
      },
      include: {
        tratamento: {
          include: { medicamento: true },
        },
      },
    });
  }

  async obterEstatisticas(id_paciente?: number) {
    const where = id_paciente ? { id_paciente } : {};

    const total = await prisma.adesaoMedicamento.count({ where });
    const tomados = await prisma.adesaoMedicamento.count({
      where: { ...where, status: "TOMADO" },
    });
    const pendentes = await prisma.adesaoMedicamento.count({
      where: { ...where, status: "PENDENTE" },
    });
    const perdidos = await prisma.adesaoMedicamento.count({
      where: { ...where, status: "PERDIDO" },
    });
    const adiados = await prisma.adesaoMedicamento.count({
      where: { ...where, status: "ADIADO" },
    });

    const taxa_adesao = total > 0 ? ((tomados / total) * 100).toFixed(2) : "0";

    return {
      total,
      tomados,
      pendentes,
      perdidos,
      adiados,
      taxa_adesao: parseFloat(taxa_adesao as string),
    };
  }

  async excluir(id_adesao: number) {
    const adesao = await prisma.adesaoMedicamento.findUnique({
      where: { id_adesao },
    });

    if (!adesao) {
      throw new Error("Adesão não encontrada");
    }

    return await prisma.adesaoMedicamento.delete({
      where: { id_adesao },
    });
  }
}
