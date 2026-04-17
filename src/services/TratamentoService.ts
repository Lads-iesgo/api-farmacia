import prisma from '../config/prisma';

export interface CriarTratamentoDTO {
  id_paciente: number;
  id_medicamento: number;
  id_farmaceutico: number;
  id_usuario_criador: number;
  data_inicio: Date;
  data_fim?: Date;
  frequencia: string;
  dosagem_prescrita?: string;
  motivo_tratamento?: string;
  instrucoes_especiais?: string;
}

export interface AtualizarTratamentoDTO {
  data_fim?: Date;
  frequencia?: string;
  dosagem_prescrita?: string;
  motivo_tratamento?: string;
  instrucoes_especiais?: string;
  status?: 'ATIVO' | 'PAUSADO' | 'FINALIZADO';
}

export class TratamentoService {
  async criar(dados: CriarTratamentoDTO) {
    if (dados.data_fim && dados.data_fim <= dados.data_inicio) {
      throw new Error('Data de término deve ser posterior à data de início');
    }

    // Verifica se paciente existe
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente: dados.id_paciente },
    });

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    // Verifica se medicamento existe
    const medicamento = await prisma.medicamento.findUnique({
      where: { id_medicamento: dados.id_medicamento },
    });

    if (!medicamento) {
      throw new Error('Medicamento não encontrado');
    }

    // Verifica se farmacêutico existe
    const farmaceutico = await prisma.farmaceutico.findUnique({
      where: { id_farmaceutico: dados.id_farmaceutico },
    });

    if (!farmaceutico) {
      throw new Error('Farmacêutico não encontrado');
    }

    // Verifica se usuário criador existe
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: dados.id_usuario_criador },
    });

    if (!usuario) {
      throw new Error('Usuário criador não encontrado');
    }

    return await prisma.tratamento.create({
      data: {
        id_paciente: dados.id_paciente,
        id_medicamento: dados.id_medicamento,
        id_farmaceutico: dados.id_farmaceutico,
        id_usuario_criador: dados.id_usuario_criador,
        data_inicio: dados.data_inicio,
        data_fim: dados.data_fim,
        frequencia: dados.frequencia,
        dosagem_prescrita: dados.dosagem_prescrita,
        motivo_tratamento: dados.motivo_tratamento,
        instrucoes_especiais: dados.instrucoes_especiais,
      },
      include: {
        paciente: {
          include: {
            usuario: { select: { nome: true, email: true } },
          },
        },
        medicamento: true,
        farmaceutico: true,
        usuario_criador: { select: { nome: true, email: true } },
      },
    });
  }

  async listar(skip: number = 0, take: number = 10) {
    const tratamentos = await prisma.tratamento.findMany({
      skip,
      take,
      include: {
        paciente: {
          include: {
            usuario: { select: { nome: true, email: true } },
          },
        },
        medicamento: true,
        farmaceutico: true,
        usuario_criador: { select: { nome: true, email: true } },
      },
      orderBy: { data_criacao: 'desc' },
    });

    const total = await prisma.tratamento.count();

    return { tratamentos, total };
  }

  async listarPorPaciente(id_paciente: number) {
    return await prisma.tratamento.findMany({
      where: { id_paciente },
      include: {
        medicamento: true,
        farmaceutico: true,
        usuario_criador: { select: { nome: true, email: true } },
        adesoes: {
          orderBy: { data_prevista: 'desc' },
        },
      },
      orderBy: { data_criacao: 'desc' },
    });
  }

  async obterPorId(id_tratamento: number) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { id_tratamento },
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
        farmaceutico: true,
        usuario_criador: { select: { id_usuario: true, nome: true, email: true } },
        adesoes: {
          orderBy: { data_prevista: 'desc' },
        },
      },
    });

    if (!tratamento) {
      throw new Error('Tratamento não encontrado');
    }

    return tratamento;
  }

  async atualizar(id_tratamento: number, dados: AtualizarTratamentoDTO) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { id_tratamento },
    });

    if (!tratamento) {
      throw new Error('Tratamento não encontrado');
    }

    if (dados.data_fim && dados.data_fim <= tratamento.data_inicio) {
      throw new Error('Data de término deve ser posterior à data de início');
    }

    return await prisma.tratamento.update({
      where: { id_tratamento },
      data: {
        data_fim: dados.data_fim,
        frequencia: dados.frequencia,
        dosagem_prescrita: dados.dosagem_prescrita,
        motivo_tratamento: dados.motivo_tratamento,
        instrucoes_especiais: dados.instrucoes_especiais,
        status: dados.status,
      },
      include: {
        paciente: {
          include: {
            usuario: { select: { nome: true, email: true } },
          },
        },
        medicamento: true,
        farmaceutico: true,
        usuario_criador: { select: { nome: true, email: true } },
      },
    });
  }

  async excluir(id_tratamento: number) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { id_tratamento },
    });

    if (!tratamento) {
      throw new Error('Tratamento não encontrado');
    }

    return await prisma.tratamento.delete({
      where: { id_tratamento },
    });
  }

  async finalizarTratamento(id_tratamento: number) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { id_tratamento },
    });

    if (!tratamento) {
      throw new Error('Tratamento não encontrado');
    }

    return await prisma.tratamento.update({
      where: { id_tratamento },
      data: {
        status: 'FINALIZADO',
        data_fim: new Date(),
      },
      include: {
        paciente: {
          include: {
            usuario: { select: { nome: true, email: true } },
          },
        },
        medicamento: true,
        farmaceutico: true,
      },
    });
  }

  async pausarTratamento(id_tratamento: number) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { id_tratamento },
    });

    if (!tratamento) {
      throw new Error('Tratamento não encontrado');
    }

    return await prisma.tratamento.update({
      where: { id_tratamento },
      data: { status: 'PAUSADO' },
    });
  }

  async retomarTratamento(id_tratamento: number) {
    const tratamento = await prisma.tratamento.findUnique({
      where: { id_tratamento },
    });

    if (!tratamento) {
      throw new Error('Tratamento não encontrado');
    }

    return await prisma.tratamento.update({
      where: { id_tratamento },
      data: { status: 'ATIVO' },
    });
  }

  async obterEstatisticas() {
    const total = await prisma.tratamento.count();
    const ativos = await prisma.tratamento.count({
      where: { status: 'ATIVO' },
    });
    const pausados = await prisma.tratamento.count({
      where: { status: 'PAUSADO' },
    });
    const finalizados = await prisma.tratamento.count({
      where: { status: 'FINALIZADO' },
    });

    return { total, ativos, pausados, finalizados };
  }
}
