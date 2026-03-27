# 🏥 API Farmácia - Backend

Backend completo para o Sistema de Gerenciamento de Farmácia, desenvolvido com **Node.js**, **Express**, **TypeScript** e **Prisma ORM**.

## 📋 Índice

- [Recursos](#-recursos)
- [Tecnologias](#-tecnologias)
- [Pré-requisitos](#-pré-requisitos)
- [Instalação](#-instalação)
- [Configuração](#-configuração)
- [Executar](#-executar)
- [Endpoints](#-endpoints)
- [Estrutura de Pastas](#-estrutura-de-pastas)

## ✨ Recursos

- **Autenticação com JWT**: Sistema seguro de login e autenticação
- **Recuperação de Senha**: Geração de tokens para reset de senha
- **Gestão de Pacientes**: CRUD completo de pacientes
- **Gestão de Medicamentos**: Controle de medicamentos disponíveis
- **Gestão de Tratamentos**: Criação e acompanhamento de tratamentos
- **Rastreamento de Adesão**: Monitoramento da adesão do paciente aos medicamentos
- **Estatísticas**: Endpoints para coletar dados e estatísticas
- **CORS**: Configurado para aceitar requisições do frontend
- **Validação de Dados**: Validação em todas as camadas
- **Tratamento de Erros**: Sistema robusto de tratamento de erros

## 🛠 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express.js** - Framework web minimalista
- **TypeScript** - Superset tipado do JavaScript
- **Prisma ORM** - ORM type-safe para Node.js
- **MySQL** - Banco de dados relacional
- **JWT** - JSON Web Tokens para autenticação
- **bcryptjs** - Hash seguro de senhas
- **CORS** - Cross-Origin Resource Sharing
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📦 Pré-requisitos

- **Node.js** (v16 ou superior)
- **npm** ou **yarn**
- **MySQL** (v8 ou superior)
- **Banco de dados criado** com a estrutura em `../Farmadb_V2.sql`

## 🚀 Instalação

### 1. Instalar dependências

```bash
cd servidor
npm install
```

### 2. Gerar cliente Prisma

```bash
npm run prisma:generate
```

### 3. Criar banco de dados (se ainda não existir)

```sql
CREATE DATABASE farmacia_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Importar schema do banco (opcional se usar migrations)

```bash
mysql -u root farmacia_db < ../Farmadb_V2.sql
```

## ⚙️ Configuração

### 1. Criar arquivo `.env`

Copie e edite o arquivo `.env.example`:

```bash
cp .env.example .env
```

### 2. Configurar variáveis

Edite o arquivo `.env` com suas configurações:

```env
# Servidor
PORT=3001
NODE_ENV=development

# Banco de dados
DATABASE_URL="mysql://usuario:senha@localhost:3306/farmacia_db"

# JWT
JWT_SECRET=sua_chave_super_secreta_aqui
JWT_EXPIRES_IN=24

# Email (SMTP)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu_email@gmail.com
SMTP_PASSWORD=sua_senha_app

# Frontend
FRONTEND_URL=http://localhost:8081

# Recuperação de Senha
RESET_PASSWORD_URL=http://localhost:8081/recuperar-senha
RESET_TOKEN_EXPIRES_IN=1
```

## 📌 Executar

### Modo Desenvolvimento

```bash
npm run dev
```

Servidor rodará em: `http://localhost:3001`

### Build para Produção

```bash
npm run build
npm start
```

### Prisma Studio (Interface visual do banco)

```bash
npm run prisma:studio
```

## 🔌 Endpoints

### 🔐 Autenticação (`/api/auth`)

- `POST /registrar` - Criar novo usuário
- `POST /login` - Fazer login
- `POST /recuperar-senha` - Solicitar recuperação de senha
- `POST /resetar-senha` - Resetar senha com token
- `POST /alterar-senha` - Alterar senha (requer autenticação)

### 👥 Pacientes (`/api/pacientes`)

- `POST /` - Criar paciente
- `GET /` - Listar pacientes (paginado)
- `GET /:id` - Obter detalhes do paciente
- `PUT /:id` - Atualizar paciente
- `DELETE /:id` - Excluir paciente

### 💊 Medicamentos (`/api/medicamentos`)

- `POST /` - Criar medicamento
- `GET /` - Listar medicamentos ativos (paginado)
- `GET /todos` - Listar todos os medicamentos
- `GET /buscar?termo=xyz` - Buscar medicamento por termo
- `GET /:id` - Obter detalhes do medicamento
- `PUT /:id` - Atualizar medicamento
- `DELETE /:id` - Marcar medicamento como inativo

### 🏥 Tratamentos (`/api/tratamentos`)

- `POST /` - Criar tratamento
- `GET /` - Listar tratamentos (paginado)
- `GET /paciente/:id_paciente` - Listar tratamentos por paciente
- `GET /estatisticas/resume` - Obter estatísticas
- `GET /:id` - Obter detalhes do tratamento
- `PUT /:id` - Atualizar tratamento
- `DELETE /:id` - Excluir tratamento
- `PATCH /:id/finalizar` - Finalizar tratamento
- `PATCH /:id/pausar` - Pausar tratamento
- `PATCH /:id/retomar` - Retomar tratamento

### 📊 Adesões (`/api/adesoes`)

- `POST /` - Registrar adesão
- `GET /` - Listar adesões (paginado)
- `GET /paciente/:id_paciente` - Listar adesões por paciente
- `GET /estatisticas/resume` - Obter estatísticas de adesão
- `GET /:id` - Obter detalhes da adesão
- `PUT /:id` - Atualizar adesão
- `PATCH /:id/marcar-tomado` - Marcar medicamento como tomado

## 📁 Estrutura de Pastas

```
servidor/
├── src/
│   ├── config/
│   │   └── prisma.ts              # Configuração do Prisma
│   ├── controllers/
│   │   ├── AutenticacaoController.ts
│   │   ├── PacienteController.ts
│   │   ├── MedicamentoController.ts
│   │   ├── TratamentoController.ts
│   │   └── AdesaoController.ts
│   ├── middleware/
│   │   ├── auth.ts                # Middleware de autenticação JWT
│   │   └── errorHandler.ts        # Tratamento de erros
│   ├── routes/
│   │   ├── auth.routes.ts
│   │   ├── paciente.routes.ts
│   │   ├── medicamento.routes.ts
│   │   ├── tratamento.routes.ts
│   │   └── adesao.routes.ts
│   ├── services/
│   │   ├── AutenticacaoService.ts
│   │   ├── PacienteService.ts
│   │   ├── MedicamentoService.ts
│   │   ├── TratamentoService.ts
│   │   └── AdesaoService.ts
│   └── index.ts                   # Ponto de entrada da aplicação
├── prisma/
│   └── schema.prisma              # Schema do banco de dados
├── .env                           # Variáveis de ambiente
├── .env.example                   # Exemplo de variáveis
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

## 🔒 Autenticação

Todos os endpoints (exceto os de autenticação pública) requerem autenticação via JWT.

### Como usar:

1. Faça login em `/api/auth/login`
2. Receba um `token` na resposta
3. Adicione o token no header de todas as requisições:

```
Authorization: Bearer seu_token_aqui
```

## 📝 Exemplos de Requisições

### Registrar Usuário

```bash
curl -X POST http://localhost:3001/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "João Silva",
    "email": "joao@example.com",
    "senha": "senha123",
    "tipo_usuario": "COORDENADOR",
    "telefone": "11999999999"
  }'
```

### Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "joao@example.com",
    "senha": "senha123"
  }'
```

### Criar Paciente (requer token)

```bash
curl -X POST http://localhost:3001/api/pacientes \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer seu_token" \
  -d '{
    "id_usuario": 1,
    "numero_identificacao": "12345678901",
    "data_nascimento": "1990-01-15",
    "genero": "M",
    "endereco": "Rua Principal, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "alergias": "Penicilina"
  }'
```

## 🤝 Contribuindo

Sinta-se à vontade para fazer fork, criar branches e enviar pull requests.

## 📄 Licença

MIT

## 📞 Suporte

Para problemas ou dúvidas, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para o Sistema de Gerenciamento de Farmácia**
