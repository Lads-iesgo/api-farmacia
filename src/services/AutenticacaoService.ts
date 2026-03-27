import prisma from '../config/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

interface CriarUsuarioDTO {
  nome: string;
  email: string;
  senha: string;
  tipo_usuario: 'COORDENADOR' | 'ALUNO' | 'PACIENTE';
  telefone?: string;
}

interface LoginDTO {
  email: string;
  senha: string;
}

export class AutenticacaoService {
  async criarUsuario(dados: CriarUsuarioDTO) {
    // Verifica se email já existe
    const usuarioExistente = await prisma.usuario.findUnique({
      where: { email: dados.email },
    });

    if (usuarioExistente) {
      throw new Error('Email já cadastrado');
    }

    // Hash da senha
    const senhaHash = await bcrypt.hash(dados.senha, 10);

    // Cria usuário
    const usuario = await prisma.usuario.create({
      data: {
        nome: dados.nome,
        email: dados.email,
        senha: senhaHash,
        tipo_usuario: dados.tipo_usuario,
        telefone: dados.telefone,
      },
      select: {
        id_usuario: true,
        nome: true,
        email: true,
        tipo_usuario: true,
        telefone: true,
        data_cadastro: true,
      },
    });

    return usuario;
  }

  async login(dados: LoginDTO) {
    // Busca usuário
    const usuario = await prisma.usuario.findUnique({
      where: { email: dados.email },
    });

    if (!usuario) {
      throw new Error('Email ou senha incorretos');
    }

    // Verifica se está ativo
    if (!usuario.ativo) {
      throw new Error('Usuário inativo');
    }

    // Compara senha
    const senhaValida = await bcrypt.compare(dados.senha, usuario.senha);

    if (!senhaValida) {
      throw new Error('Email ou senha incorretos');
    }

    // Atualiza último acesso
    await prisma.usuario.update({
      where: { id_usuario: usuario.id_usuario },
      data: { ultimo_acesso: new Date() },
    });

    // Gera token JWT
    const jwtSecret = (process.env.JWT_SECRET || 'seu_secret') as string;
    const jwtOptions: any = {
      expiresIn: process.env.JWT_EXPIRES_IN || '24h',
    };

    const token = jwt.sign(
      {
        id_usuario: usuario.id_usuario,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
      jwtSecret,
      jwtOptions
    );

    return {
      token,
      usuario: {
        id_usuario: usuario.id_usuario,
        nome: usuario.nome,
        email: usuario.email,
        tipo_usuario: usuario.tipo_usuario,
      },
    };
  }

  async solicitarRecuperacaoSenha(email: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { email },
    });

    if (!usuario) {
      // Por segurança, não informamos se o email existe ou não
      return { mensagem: 'Se o email existe, um link de recuperação foi enviado' };
    }

    // Gera token único
    const token = crypto.randomBytes(32).toString('hex');
    const dataExpiracao = new Date();
    dataExpiracao.setHours(dataExpiracao.getHours() + (parseInt(process.env.RESET_TOKEN_EXPIRES_IN || '1')));

    // Salva token no banco
    await prisma.tokenRecuperacao.create({
      data: {
        id_usuario: usuario.id_usuario,
        token,
        expira_em: dataExpiracao,
      },
    });

    // TODO: Implementar envio de email com link
    // const linkRecuperacao = `${process.env.RESET_PASSWORD_URL}?token=${token}`;
    // await enviarEmail(usuario.email, linkRecuperacao);

    return { mensagem: 'Se o email existe, um link de recuperação foi enviado' };
  }

  async resetarSenha(token: string, novaSenha: string) {
    // Busca token válido
    const tokenRecuperacao = await prisma.tokenRecuperacao.findUnique({
      where: { token },
      include: { usuario: true },
    });

    if (!tokenRecuperacao) {
      throw new Error('Token inválido');
    }

    if (tokenRecuperacao.usado_em) {
      throw new Error('Token já foi utilizado');
    }

    if (tokenRecuperacao.revogado_em) {
      throw new Error('Token foi revogado');
    }

    if (new Date() > tokenRecuperacao.expira_em) {
      throw new Error('Token expirado');
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    // Atualiza senha e marca token como usado
    await Promise.all([
      prisma.usuario.update({
        where: { id_usuario: tokenRecuperacao.id_usuario },
        data: { senha: senhaHash },
      }),
      prisma.tokenRecuperacao.update({
        where: { id_token: tokenRecuperacao.id_token },
        data: { usado_em: new Date() },
      }),
    ]);

    return { mensagem: 'Senha alterada com sucesso' };
  }

  async alterarSenha(id_usuario: number, senhaAtual: string, novaSenha: string) {
    const usuario = await prisma.usuario.findUnique({
      where: { id_usuario },
    });

    if (!usuario) {
      throw new Error('Usuário não encontrado');
    }

    // Compara senha atual
    const senhaValida = await bcrypt.compare(senhaAtual, usuario.senha);

    if (!senhaValida) {
      throw new Error('Senha atual incorreta');
    }

    // Hash da nova senha
    const senhaHash = await bcrypt.hash(novaSenha, 10);

    await prisma.usuario.update({
      where: { id_usuario },
      data: { senha: senhaHash },
    });

    return { mensagem: 'Senha alterada com sucesso' };
  }
}
