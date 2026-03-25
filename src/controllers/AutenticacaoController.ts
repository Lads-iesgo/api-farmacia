import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { AutenticacaoService } from '../services/AutenticacaoService';

const autenticacaoService = new AutenticacaoService();

export class AutenticacaoController {
  async registrar(req: AuthRequest, res: Response) {
    try {
      const { nome, email, senha, tipo_usuario, telefone } = req.body;

      if (!nome || !email || !senha || !tipo_usuario) {
        return res.status(400).json({
          erro: 'Nome, email, senha e tipo_usuario são obrigatórios',
        });
      }

      const usuario = await autenticacaoService.criarUsuario({
        nome,
        email,
        senha,
        tipo_usuario,
        telefone,
      });

      return res.status(201).json({
        mensagem: 'Usuário criado com sucesso',
        usuario,
      });
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao criar usuário',
      });
    }
  }

  async login(req: AuthRequest, res: Response) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({
          erro: 'Email e senha são obrigatórios',
        });
      }

      const resultado = await autenticacaoService.login({ email, senha });

      return res.status(200).json({
        mensagem: 'Login realizado com sucesso',
        ...resultado,
      });
    } catch (error: any) {
      return res.status(401).json({
        erro: error.message || 'Erro ao fazer login',
      });
    }
  }

  async solicitarRecuperacaoSenha(req: AuthRequest, res: Response) {
    try {
      const { email } = req.body;

      if (!email) {
        return res.status(400).json({
          erro: 'Email é obrigatório',
        });
      }

      const resultado = await autenticacaoService.solicitarRecuperacaoSenha(email);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao solicitar recuperação de senha',
      });
    }
  }

  async resetarSenha(req: AuthRequest, res: Response) {
    try {
      const { token, novaSenha } = req.body;

      if (!token || !novaSenha) {
        return res.status(400).json({
          erro: 'Token e novaSenha são obrigatórios',
        });
      }

      const resultado = await autenticacaoService.resetarSenha(token, novaSenha);

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao resetar senha',
      });
    }
  }

  async alterarSenha(req: AuthRequest, res: Response) {
    try {
      if (!req.usuario) {
        return res.status(401).json({
          erro: 'Usuário não autenticado',
        });
      }

      const { senhaAtual, novaSenha } = req.body;

      if (!senhaAtual || !novaSenha) {
        return res.status(400).json({
          erro: 'Senha atual e nova senha são obrigatórias',
        });
      }

      const resultado = await autenticacaoService.alterarSenha(
        req.usuario.id_usuario,
        senhaAtual,
        novaSenha
      );

      return res.status(200).json(resultado);
    } catch (error: any) {
      return res.status(400).json({
        erro: error.message || 'Erro ao alterar senha',
      });
    }
  }
}
