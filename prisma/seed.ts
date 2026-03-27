import prisma from '../src/config/prisma';
import bcrypt from 'bcryptjs';

async function main() {
  console.log('🌱 Iniciando seed do banco de dados...\n');

  // Limpar dados existentes (cuidado em produção!)
  console.log('🗑️  Limpando dados antigos...');
  // await prisma.notificacao.deleteMany();
  // await prisma.adesaoMedicamento.deleteMany();
  // await prisma.auditoria.deleteMany();
  // await prisma.permissaoAluno.deleteMany();
  // await prisma.tratamento.deleteMany();
  // await prisma.paciente.deleteMany();
  // await prisma.medicamento.deleteMany();
  // await prisma.usuario.deleteMany();
  // await prisma.tokenRecuperacao.deleteMany();

  // Criar usuários
  console.log('👥 Criando usuários...');
  const usuarios = await prisma.usuario.createMany({
    data: [
      {
        nome: 'Admin',
        email: 'admin@farmacia.com',
        senha: await bcrypt.hash('admin123', 10),
        tipo_usuario: 'COORDENADOR',
        telefone: '11999999999',
      },
      {
        nome: 'Maria Silva',
        email: 'maria@farmacia.com',
        senha: await bcrypt.hash('maria123', 10),
        tipo_usuario: 'ALUNO',
        telefone: '11988888888',
      },
      {
        nome: 'João Santos',
        email: 'joao@farmacia.com',
        senha: await bcrypt.hash('joao123', 10),
        tipo_usuario: 'PACIENTE',
        telefone: '11987654321',
      },
      {
        nome: 'Ana Costa',
        email: 'ana@farmacia.com',
        senha: await bcrypt.hash('ana123', 10),
        tipo_usuario: 'PACIENTE',
        telefone: '11912345678',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${usuarios.count} usuários criados`);

  // Criar pacientes
  console.log('🏥 Criando pacientes...');
  const pacientes = await prisma.paciente.createMany({
    data: [
      {
        id_usuario: 3,
        numero_identificacao: '12345678901',
        data_nascimento: new Date('1990-05-15'),
        genero: 'M',
        endereco: 'Rua A, 123',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '01234-567',
        historico_medico: 'Histórico de hipertensão',
        alergias: 'Penicilina',
      },
      {
        id_usuario: 4,
        numero_identificacao: '98765432109',
        data_nascimento: new Date('1985-08-22'),
        genero: 'F',
        endereco: 'Rua B, 456',
        cidade: 'São Paulo',
        estado: 'SP',
        cep: '02345-678',
        historico_medico: 'Diabetes tipo 2',
        alergias: 'Aspirina',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${pacientes.count} pacientes criados`);

  // Criar medicamentos
  console.log('💊 Criando medicamentos...');
  const medicamentos = await prisma.medicamento.createMany({
    data: [
      {
        nome_medicamento: 'Dipirona 500mg',
        principio_ativo: 'Dipirona',
        dosagem: '500mg',
        apresentacao: 'Comprimido',
        fabricante: 'Laboratório X',
        lote: 'LT001',
        data_validade: new Date('2025-12-31'),
        descricao: 'Analgésico e antipirético',
        efeitos_colaterais: 'Reações alérgicas em alguns pacientes',
      },
      {
        nome_medicamento: 'Losartana 50mg',
        principio_ativo: 'Losartana Potássica',
        dosagem: '50mg',
        apresentacao: 'Comprimido',
        fabricante: 'Laboratório Y',
        lote: 'LT002',
        data_validade: new Date('2025-10-15'),
        descricao: 'Antihipertensivo',
        efeitos_colaterais: 'Tontura, fraqueza',
      },
      {
        nome_medicamento: 'Metformina 850mg',
        principio_ativo: 'Metformina',
        dosagem: '850mg',
        apresentacao: 'Comprimido',
        fabricante: 'Laboratório Z',
        lote: 'LT003',
        data_validade: new Date('2026-06-30'),
        descricao: 'Medicamento para diabetes',
        efeitos_colaterais: 'Problemas gástricos',
      },
      {
        nome_medicamento: 'Amoxicilina 500mg',
        principio_ativo: 'Amoxicilina',
        dosagem: '500mg',
        apresentacao: 'Cápsula',
        fabricante: 'Laboratório W',
        lote: 'LT004',
        data_validade: new Date('2025-08-20'),
        descricao: 'Antibiótico',
        efeitos_colaterais: 'Alergia, dor abdominal',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${medicamentos.count} medicamentos criados`);

  // Criar tratamentos
  console.log('🩺 Criando tratamentos...');
  const tratamentos = await prisma.tratamento.createMany({
    data: [
      {
        id_paciente: 1,
        id_medicamento: 2,
        id_usuario_criador: 1,
        data_inicio: new Date('2024-01-15'),
        data_fim: new Date('2026-01-15'),
        frequencia: 'Uma vez ao dia',
        dosagem_prescrita: '50mg',
        motivo_tratamento: 'Controle de hipertensão',
        instrucoes_especiais: 'Tomar em jejum',
        status: 'ATIVO',
      },
      {
        id_paciente: 2,
        id_medicamento: 3,
        id_usuario_criador: 1,
        data_inicio: new Date('2024-02-01'),
        data_fim: new Date('2026-02-01'),
        frequencia: 'Duas vezes ao dia',
        dosagem_prescrita: '850mg',
        motivo_tratamento: 'Controle de diabetes',
        instrucoes_especiais: 'Tomar com alimentos',
        status: 'ATIVO',
      },
      {
        id_paciente: 1,
        id_medicamento: 1,
        id_usuario_criador: 1,
        data_inicio: new Date('2024-01-10'),
        data_fim: new Date('2024-01-20'),
        frequencia: 'A cada 6 horas',
        dosagem_prescrita: '500mg',
        motivo_tratamento: 'Tratamento de inflamação',
        instrucoes_especiais: 'Conforme necessário',
        status: 'FINALIZADO',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ ${tratamentos.count} tratamentos criados`);

  console.log('\n✨ Seed concluído com sucesso!');
  console.log('\n📊 Dados de teste:');
  console.log('   Email: admin@farmacia.com | Senha: admin123');
  console.log('   Email: maria@farmacia.com | Senha: maria123');
  console.log('   Email: joao@farmacia.com | Senha: joao123');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
