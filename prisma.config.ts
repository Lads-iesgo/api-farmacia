import "dotenv/config";
import { defineConfig } from "prisma/config";

// Configuração do Prisma para conectar ao banco de dados usando a variável de ambiente
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL!,
  },
}); 
