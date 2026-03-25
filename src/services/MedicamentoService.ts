import prisma from '../config/prisma';

export interface CriarMedicamentoDTO {
  nome_medicamento: string;
  principio_ativo?: string;
  dosagem?: string;
  apresentacao?: string;
  fabricante?: string;
  lote?: string;
  data_validade?: Date;
  descricao?: string;
  efeitos_colaterais?: string;
}

export interface AtualizarMedicamentoDTO {
  nome_medicamento?: string;
  principio_ativo?: string;
  dosagem?: string;
  apresentacao?: string;
  fabricante?: string;
  lote?: string;
  data_validade?: Date;
  descricao?: string;
  efeitos_colaterais?: string;
  ativo?: boolean;
}

export class MedicamentoService {
  async criar(dados: CriarMedicamentoDTO) {
    // Verifica se nome já existe
    const medicamentoExistente = await prisma.medicamento.findUnique({
      where: { nome_medicamento: dados.nome_medicamento },
    });

    if (medicamentoExistente) {
      throw new Error('Medicamento com esse nome já existe');
    }

    return await prisma.medicamento.create({
      data: {
        nome_medicamento: dados.nome_medicamento,
        principio_ativo: dados.principio_ativo,
        dosagem: dados.dosagem,
        apresentacao: dados.apresentacao,
        fabricante: dados.fabricante,
        lote: dados.lote,
        data_validade: dados.data_validade,
        descricao: dados.descricao,
        efeitos_colaterais: dados.efeitos_colaterais,
      },
    });
  }

  async listar(skip: number = 0, take: number = 10) {
    const medicamentos = await prisma.medicamento.findMany({
      skip,
      take,
      where: { ativo: true },
      orderBy: { nome_medicamento: 'asc' },
    });

    const total = await prisma.medicamento.count({
      where: { ativo: true },
    });

    return { medicamentos, total };
  }

  async listarTodos(skip: number = 0, take: number = 10) {
    const medicamentos = await prisma.medicamento.findMany({
      skip,
      take,
      orderBy: { nome_medicamento: 'asc' },
    });

    const total = await prisma.medicamento.count();

    return { medicamentos, total };
  }

  async obterPorId(id_medicamento: number) {
    const medicamento = await prisma.medicamento.findUnique({
      where: { id_medicamento },
      include: {
        tratamentos: {
          select: {
            id_tratamento: true,
            paciente: { select: { usuario: { select: { nome: true } } } },
            status: true,
          },
        },
      },
    });

    if (!medicamento) {
      throw new Error('Medicamento não encontrado');
    }

    return medicamento;
  }

  async atualizar(id_medicamento: number, dados: AtualizarMedicamentoDTO) {
    const medicamento = await prisma.medicamento.findUnique({
      where: { id_medicamento },
    });

    if (!medicamento) {
      throw new Error('Medicamento não encontrado');
    }

    // Se está mudando o nome, valida se já existe
    if (dados.nome_medicamento && dados.nome_medicamento !== medicamento.nome_medicamento) {
      const existente = await prisma.medicamento.findUnique({
        where: { nome_medicamento: dados.nome_medicamento },
      });

      if (existente && existente.id_medicamento !== id_medicamento) {
        throw new Error('Já existe medicamento com esse nome');
      }
    }

    return await prisma.medicamento.update({
      where: { id_medicamento },
      data: {
        nome_medicamento: dados.nome_medicamento,
        principio_ativo: dados.principio_ativo,
        dosagem: dados.dosagem,
        apresentacao: dados.apresentacao,
        fabricante: dados.fabricante,
        lote: dados.lote,
        data_validade: dados.data_validade,
        descricao: dados.descricao,
        efeitos_colaterais: dados.efeitos_colaterais,
        ativo: dados.ativo,
      },
    });
  }

  async excluir(id_medicamento: number) {
    const medicamento = await prisma.medicamento.findUnique({
      where: { id_medicamento },
    });

    if (!medicamento) {
      throw new Error('Medicamento não encontrado');
    }

    // Ao invés de excluir, marca como inativo
    return await prisma.medicamento.update({
      where: { id_medicamento },
      data: { ativo: false },
    });
  }

  async buscar(termo: string) {
    return await prisma.medicamento.findMany({
      where: {
        OR: [
          { nome_medicamento: { contains: termo } },
          { principio_ativo: { contains: termo } },
          { fabricante: { contains: termo } },
        ],
        ativo: true,
      },
      take: 10,
    });
  }
}
