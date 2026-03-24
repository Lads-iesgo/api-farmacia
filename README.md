# API Backend - Farmácia IESGO

Backend desenvolvido em **Node.js + TypeScript** para o sistema de gerenciamento da Farmácia IESGO. Este projeto fornece uma API RESTful segura e escalável, com foco em boas práticas de engenharia de software, arquitetura limpa e segurança da informação.

## Tecnologias Utilizadas

* **Node.js & Express:** Servidor e roteamento web.
* **TypeScript:** Tipagem estática para um código mais seguro.
* **Prisma ORM:** Gerenciamento do banco de dados (MySQL).
* **Nodemailer:** Envio de e-mails transacionais (Configurado para Mailtrap em dev).
* **Bcrypt & Crypto:** Criptografia avançada de senhas e geração de Hashes SHA-256 para tokens.

---

## Como rodar o projeto localmente

### 1. Pré-requisitos
Certifique-se de ter instalado em sua máquina:
* [Node.js](https://nodejs.org/) (versão 18 ou superior)
* Um banco de dados **MySQL** rodando (ex: XAMPP, Docker, etc.)

### 2. Instalação e Configuração

1. Instale as dependências do projeto:
\`\`\`bash
npm install
\`\`\`

2. Configure as variáveis de ambiente:
Crie um arquivo chamado `.env` na raiz do projeto (use o arquivo `.env.example` como base) e preencha com as suas credenciais de banco de dados e servidor de e-mail.

3. Sincronize o Banco de Dados:
Crie as tabelas no seu MySQL rodando o comando do Prisma:
\`\`\`bash
npx prisma db push
\`\`\`

4. Inicie o servidor em modo de desenvolvimento:
\`\`\`bash
npm run dev
\`\`\`
O servidor iniciará em `http://localhost:3333`.

---

## Documentação da API (Rotas de Autenticação)

O sistema de recuperação de senhas possui segurança nível bancário, incluindo **Soft Delete (Auditoria de uso)**, **Validade Temporal (30 minutos)** e **Hashes SHA-256** para os tokens no banco de dados.

### 1. Solicitar Recuperação de Senha
Gera um token seguro e envia por e-mail para o usuário.

* **Rota:** `POST /esqueci-senha`
* **Body (JSON):**
\`\`\`json
{
  "email": "cliente@farmacia.com"
}
\`\`\`

* **Respostas:**
  * `200 OK`: `{"message": "E-mail de recuperação enviado com sucesso!"}`
  * `400 Bad Request`: `{"error": "O e-mail é obrigatório."}`
  * `404 Not Found`: `{"error": "Usuário não encontrado."}`

### 2. Redefinir a Senha
Valida o token criptografado e salva a nova senha do usuário.

* **Rota:** `POST /redefinir-senha`
* **Body (JSON):**
\`\`\`json
{
  "token": "token_recebido_no_email_aqui",
  "novaSenha": "NovaSenhaSegura123!"
}
\`\`\`

* **Respostas:**
  * `200 OK`: `{"message": "Senha redefinida com sucesso!"}`
  * `400 Bad Request`: `{"error": "Token e nova senha são obrigatórios."}`
  * `400 Bad Request`: `{"error": "Token inválido ou não encontrado."}`
  * `400 Bad Request`: `{"error": "Este link de recuperação já foi utilizado."}`
  * `400 Bad Request`: `{"error": "O link expirou. Solicite a recuperação novamente."}`