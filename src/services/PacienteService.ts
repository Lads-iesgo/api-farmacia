import prisma from '../config/prisma';

export interface CriarPacienteDTO {
  id_usuario: number;
  numero_identificacao: string;
  data_nascimento?: Date;
  genero?: 'M' | 'F' | 'OUTRO';
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  historico_medico?: string;
  alergias?: string;
}

export interface AtualizarPacienteDTO {
  numero_identificacao?: string;
  data_nascimento?: Date;
  genero?: 'M' | 'F' | 'OUTRO';
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  historico_medico?: string;
  alergias?: string;
}

export class PacienteService {
  async criar(dados: CriarPacienteDTO) {
    // Verifica se usuário existe
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario: dados.id_usuario },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Verifica se número de identificação já existe
    const pacienteExistente = await prisma.paciente.findUnique({
      where: { numero_identificacao: dados.numero_identificacao },
    });

    if (pacienteExistente) {
      throw new Error('Número de identificação já cadastrado');
    }

    const paciente = await prisma.paciente.create({
      data: {
        id_usuario: dados.id_usuario,
        numero_identificacao: dados.numero_identificacao,
        data_nascimento: dados.data_nascimento,
        genero: dados.genero || 'OUTRO',
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
  }

  async listar(skip: number = 0, take: number = 10) {
    const pacientes = await prisma.paciente.findMany({
      skip,
      take,
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
        tratamentos: {
          select: {
            id_tratamento: true,
            medicamento: { select: { nome_medicamento: true } },
            status: true,
          },
        },
      },
      orderBy: { data_registro: 'desc' },
    });

    const total = await prisma.paciente.count();

    return { pacientes, total };
  }

  async obterPorId(id_paciente: number) {
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente },
      include: {
        usuario: {
          select: {
            id_usuario: true,
            nome: true,
            email: true,
            telefone: true,
            ativo: true,
          },
        },
        tratamentos: {
          include: {
            medicamento: true,
          },
        },
      },
    });

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    return paciente;
  }

  async atualizar(id_paciente: number, dados: AtualizarPacienteDTO) {
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente },
    });

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    // Se está mudando o número de identificação, valida se já existe
    if (dados.numero_identificacao && dados.numero_identificacao !== paciente.numero_identificacao) {
      const existente = await prisma.paciente.findUnique({
        where: { numero_identificacao: dados.numero_identificacao },
      });

      if (existente && existente.id_paciente !== id_paciente) {
        throw new Error('Número de identificação já está em uso');
      }
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
          select: {
            id_usuario: true,
            nome: true,
            email: true,
            telefone: true,
          },
        },
      },
    });
  }

  async excluir(id_paciente: number) {
    const paciente = await prisma.paciente.findUnique({
      where: { id_paciente },
    });

    if (!paciente) {
      throw new Error('Paciente não encontrado');
    }

    // Verifica se tem tratamentos ativos
    const tratamentosAtivos = await prisma.tratamento.findMany({
      where: {
        id_paciente,
        status: 'ATIVO',
      },
    });

    if (tratamentosAtivos.length > 0) {
      throw new Error('Não é possível excluir paciente com tratamentos ativos');
    }

    return await prisma.paciente.delete({
      where: { id_paciente },
    });
  }
}
