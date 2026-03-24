import express from 'express';
import cors from 'cors';
import routes from './routes.js';

const app = express();

// 1. Libera o acesso para o navegador da equipe de Front-end
app.use(cors());

// 2. Ensina o Express a ler o corpo das requisições em formato JSON
app.use(express.json());

// 3. Importa e ativa todas as nossas rotas
app.use(routes);

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}!`);
});