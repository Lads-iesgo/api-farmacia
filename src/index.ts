import express, { Express } from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorHandler } from "./middleware/errorHandler";

// Importar rotas
import authRoutes from "./routes/auth.routes";
import pacienteRoutes from "./routes/paciente.routes";
import medicamentoRoutes from "./routes/medicamento.routes";
import tratamentoRoutes from "./routes/tratamento.routes";
import adesaoRoutes from "./routes/adesao.routes";

// Carregar variáveis de ambiente
dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3001;

// Middlewares
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://10.0.2.2:3333",
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/medicamentos", medicamentoRoutes);
app.use("/api/tratamentos", tratamentoRoutes);
app.use("/api/adesoes", adesaoRoutes);

// Rota de health check
app.get("/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "API Farmácia está rodando",
    timestamp: new Date().toISOString(),
  });
});

// Rota raiz
app.get("/", (req, res) => {
  res.json({
    message: "Bem-vindo à API de Gerenciamento de Farmácia",
    version: "1.0.0",
    endpoints: {
      autenticacao: "/api/auth",
      pacientes: "/api/pacientes",
      medicamentos: "/api/medicamentos",
      tratamentos: "/api/tratamentos",
      adesoes: "/api/adesoes",
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
