import express, { Express } from 'express';
import cors from 'cors';
import compression from 'compression';
import dotenv from 'dotenv';
import { errorHandler } from './middleware/errorHandler';

// Importar rotas
import authRoutes from './routes/auth.routes';
import pacienteRoutes from './routes/paciente.routes';
import medicamentoRoutes from './routes/medicamento.routes';
import farmaceuticoRoutes from './routes/farmaceutico.routes';
import tratamentoRoutes from './routes/tratamento.routes';
import adesaoRoutes from './routes/adesao.routes';

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

const allowedOrigins = (process.env.FRONTEND_URLS || process.env.FRONTEND_URL || '')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

const isDevMobileOrigin = (origin: string) => {
  const localhostPattern = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;
  const privateNetworkPattern = /^https?:\/\/(10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(1[6-9]|2\d|3[0-1])\.\d{1,3}\.\d{1,3})(:\d+)?$/;

  return localhostPattern.test(origin) || privateNetworkPattern.test(origin);
};

// Middlewares
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin) || isDevMobileOrigin(origin)) {
      return callback(null, true);
    }

    return callback(null, false);
  },
  credentials: true,
}));

app.use(compression());
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/pacientes', pacienteRoutes);
app.use('/api/medicamentos', medicamentoRoutes);
app.use('/api/farmaceuticos', farmaceuticoRoutes);
app.use('/api/tratamentos', tratamentoRoutes);
app.use('/api/adesoes', adesaoRoutes);

// Rota de health check
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    message: 'API Farmácia está rodando',
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Bem-vindo à API de Gerenciamento de Farmácia',
    version: '1.0.0',
    endpoints: {
      autenticacao: '/api/auth',
      pacientes: '/api/pacientes',
      medicamentos: '/api/medicamentos',
      farmaceuticos: '/api/farmaceuticos',
      tratamentos: '/api/tratamentos',
      adesoes: '/api/adesoes',
    },
  });
});

// Middleware de tratamento de erros (deve ser o último)
app.use(errorHandler);

// Iniciar servidor
app.listen(port, () => {
  console.log(`✅ Servidor rodando em http://localhost:${port}`);
  console.log(`📄 Documentação: http://localhost:${port}/`);
  console.log(`🏥 Health Check: http://localhost:${port}/health`);
});

export default app;
