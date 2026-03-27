# 🚀 Guia de Setup Rápido - API Farmácia

Este guia ajudará você a configurar e executar o backend da Farmácia em minutos.

## ✅ Checklist Pré-requisitos

- [ ] Node.js v16+ instalado (`node --version`)
- [ ] npm v8+ instalado (`npm --version`)
- [ ] MySQL v8+ instalado e rodando
- [ ] Acesso ao terminal/PowerShell

## 📋 Passos de Configuração

### 1. Verificar Instalação do Node.js

```powershell
node --version
npm --version
```

### 2. Navegar até a pasta do servidor

```powershell
cd c:\Users\Usuario\Documents\api_farmacia\servidor
```

### 3. Instalar Dependências

```powershell
npm install
```

Aguarde a conclusão. Você verá algo como:
```
added 185 packages, and audited 186 packages in 10s
```

### 4. Configurar Variáveis de Ambiente

O arquivo `.env` já foi criado com valores padrão. Edite se necessário:

```powershell
# Abra o arquivo .env em um editor
# e configure conforme suas credenciais MySQL
```

**Variáveis importantes:**
- `DATABASE_URL`: Conexão ao MySQL
- `JWT_SECRET`: Chave para tokens (mude em produção!)
- `FRONTEND_URL`: URL do seu frontend

### 5. Criar Banco de Dados (se ainda não existir)

```powershell
# Abra o MySQL e crie o banco
mysql -u root

# No MySQL, execute:
CREATE DATABASE farmacia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
EXIT;
```

### 6. Gerar Cliente Prisma

```powershell
npm run prisma:generate
```

### 7. Aplicar Schema do Banco (Opcional)

Se quer importar o schema do SQL:

```powershell
mysql -u root farmacia_db < ../Farmadb_V2.sql
```

## 🎯 Executar o Servidor

### Desenvolvimento (com auto-reload)

```powershell
npm run dev
```

Você verá:
```
✅ Servidor rodando em http://localhost:3001
📄 Documentação: http://localhost:3001/
🏥 Health Check: http://localhost:3001/health
```

### Produção

```powershell
npm run build
npm start
```

## 🧪 Testar a API

### 1. Verificar se servidor está online

```powershell
curl http://localhost:3001/health
```

### 2. Registrar usuário

```powershell
curl -X POST http://localhost:3001/api/auth/registrar `
  -H "Content-Type: application/json" `
  -d '{
    "nome": "Admin",
    "email": "admin@farmacia.com",
    "senha": "Admin123! ",
    "tipo_usuario": "COORDENADOR"
  }'
```

### 3. Fazer Login

```powershell
curl -X POST http://localhost:3001/api/auth/login `
  -H "Content-Type: application/json" `
  -d '{
    "email": "admin@farmacia.com",
    "senha": "Admin123!"
  }'
```

## 📊 Visualizar Banco (Prisma Studio)

```powershell
npm run prisma:studio
```

Abre uma interface visual em `http://localhost:5555`

## 🌱 Popular Banco com Dados Teste

```powershell
npm run prisma:seed
```

Isso criará:
- 4 usuários de teste
- 2 pacientes
- 4 medicamentos
- 3 tratamentos

**Credenciais de teste:**
- Email: `admin@farmacia.com` | Senha: `admin123`
- Email: `maria@farmacia.com` | Senha: `maria123`
- Email: `joao@farmacia.com` | Senha: `joao123`

## 🔌 Conectar Frontend

No frontend, configure a URL da API:

```javascript
// app-farmacia/src/config/api.ts (ou similar)
const API_BASE_URL = 'http://localhost:3001/api';

export default API_BASE_URL;
```

## ⚙️ Estrutura de Pastas

```
servidor/
├── src/
│   ├── config/          # Configurações (Prisma)
│   ├── controllers/     # Controllers (lógica de requisições)
│   ├── middleware/      # Middlewares (auth, erros)
│   ├── routes/          # Rotas da API
│   ├── services/        # Services (lógica de negócio)
│   ├── types/           # TypeScript interfaces
│   ├── utils/           # Utilitários
│   └── index.ts         # Entrada da aplicação
├── prisma/
│   ├── schema.prisma    # Schema do banco
│   └── seed.ts          # Dados de teste
├── .env                 # Variáveis de ambiente
├── package.json
├── tsconfig.json
└── README.md
```

## 🐛 Resolver Problemas Comuns

### Erro: "Cannot connect to database"
- Verificar se MySQL está rodando
- Verificar credenciais em `.env`
- Verificar se banco `farmacia_db` existe

### Erro: "Port 3001 already in use"
- Mudar porta em `.env`: `PORT=3002`
- Ou matar processo usando a porta:
  ```powershell
  netstat -ano | findstr :3001
  taskkill /PID <PID> /F
  ```

### Erro ao instalar dependências
- Limpar cache npm:
  ```powershell
  npm cache clean --force
  rm -r node_modules
  npm install
  ```

## 📚 Documentação

- **README.md**: Visão geral do projeto
- **DOCUMENTACAO.md**: Referência completa de endpoints
- **schema.prisma**: Estrutura do banco de dados

## 🔐 Segurança

- **JWT_SECRET**: Mude para uma chave forte em produção
- **CORS**: Configurado para aceitar `FRONTEND_URL`
- **Senhas**: Armazenadas com bcrypt (hash seguro)

## 📞 Próximos Passos

1. ✅ Setup do backend completo
2. → Configurar frontend para consumir a API
3. → Testar fluxos completos de negócio
4. → Deploy em produção

## 🆘 Precisa de Ajuda?

1. Verificar logs no terminal
2. Consultar `DOCUMENTACAO.md` para referência de endpoints
3. Verificar os `controllers/` para entender a lógica

---

**Sucesso! 🚀 Seu backend está pronto para usar!**
