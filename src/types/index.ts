export interface UsuarioDTO {
  id_usuario: number;
  nome: string;
  email: string;
  tipo_usuario: "COORDENADOR" | "ALUNO" | "PACIENTE";
  telefone?: string;
  data_cadastro: Date;
  ativo: boolean;
  ultimo_acesso?: Date;
}

export interface PacienteDTO {
  id_paciente: number;
  id_usuario: number;
  nome: string;
  numero_identificacao: string;
  data_nascimento?: Date;
  genero: "M" | "F" | "OUTRO";
  endereco?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  historico_medico?: string;
  alergias?: string;
  data_registro: Date;
}

export interface MedicamentoDTO {
  id_medicamento: number;
  nome_medicamento: string;
  principio_ativo?: string;
  dosagem?: string;
  apresentacao?: string;
  fabricante?: string;
  lote?: string;
  data_validade?: Date;
  descricao?: string;
  efeitos_colaterais?: string;
  data_cadastro: Date;
  ativo: boolean;
}

export interface TratamentoDTO {
  id_tratamento: number;
  id_paciente: number;
  id_medicamento: number;
  id_usuario_criador: number;
  data_inicio: Date;
  data_fim?: Date;
  frequencia: string;
  dosagem_prescrita?: string;
  motivo_tratamento?: string;
  instrucoes_especiais?: string;
  status: "ATIVO" | "PAUSADO" | "FINALIZADO";
  data_criacao: Date;
  data_ultima_atualizacao: Date;
}

export interface AdesaoDTO {
  id_adesao: number;
  id_tratamento: number;
  id_paciente: number;
  data_prevista: Date;
  data_tomada?: Date;
  status: "PENDENTE" | "TOMADO" | "PERDIDO" | "ADIADO";
  observacoes?: string;
  registrado_em: Date;
}

export interface ApiResponse<T = any> {
  mensagem?: string;
  erro?: string;
  data?: T;
  [key: string]: any;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  take: number;
}
