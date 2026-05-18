import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  usuario?: {
    id_usuario: number;
    email: string;
    tipo_usuario: string;
  };
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('❌ JWT_SECRET não definido no .env — a API não pode iniciar sem essa variável.');
}

export const autenticacao = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ erro: 'Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as any;
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ erro: 'Token inválido ou expirado' });
  }
};

export const verificarTipo = (tipos: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    if (!req.usuario) {
      return res.status(401).json({ erro: 'Não autenticado' });
    }

    if (!tipos.includes(req.usuario.tipo_usuario)) {
      return res.status(403).json({ erro: 'Acesso negado - tipo de usuário insuficiente' });
    }

    next();
  };
};
