# 📚 Documentação de Uso da API Farmácia

## 📖 Sumário

1. [Autenticação](#-autenticação)
2. [Usuários](#-usuários)
3. [Pacientes](#-pacientes)
4. [Medicamentos](#-medicamentos)
5. [Tratamentos](#-tratamentos)
6. [Adesões](#-adesões)
7. [Códigos de Status HTTP](#-códigos-de-status-http)

---

## 🔐 Autenticação

Todos os endpoints (exceto os de autenticação pública) requerem um token JWT no header `Authorization`.

### Formato do Header

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Login

**Endpoint**: `POST /api/auth/login`

**Request**:

```json
{
  "email": "usuario@example.com",
  "senha": "senha123"
}
```

**Response** (201):

```json
{
  "mensagem": "Login realizado com sucesso",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expira_em": "2026-03-26T18:40:00.000Z",
  "usuario": {
    "id_usuario": 1,
    "nome": "Admin",
    "email": "admin@farmacia.com",
    "tipo_usuario": "COORDENADOR"
  }
}
```

### Registrar Novo Usuário

**Endpoint**: `POST /api/auth/registrar`

**Request**:

```json
{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "SenhaForte123!",
  "tipo_usuario": "ALUNO",
  "telefone": "11999999999"
}
```

**Response** (201):

```json
{
  "mensagem": "Usuário criado com sucesso",
  "usuario": {
    "id_usuario": 5,
    "nome": "João Silva",
    "email": "joao@example.com",
    "tipo_usuario": "ALUNO",
    "telefone": "11999999999",
    "data_cadastro": "2024-03-23T10:30:00Z"
  }
}
```

### Solicitar Recuperação de Senha

**Endpoint**: `POST /api/auth/recuperar-senha`

**Request**:

```json
{
  "email": "usuario@example.com"
}
```

**Response** (200):

```json
{
  "mensagem": "Se o email existe, um link de recuperação foi enviado"
}
```

### Resetar Senha

**Endpoint**: `POST /api/auth/resetar-senha`

**Request**:

```json
{
  "token": "abc123def456...",
  "novaSenha": "NovaSenhaForte123!"
}
```

**Response** (200):

```json
{
  "mensagem": "Senha alterada com sucesso"
}
```

### Alterar Senha (Autenticado)

**Endpoint**: `POST /api/auth/alterar-senha`

**Headers**:

```
Authorization: Bearer seu_token
```

**Request**:

```json
{
  "senhaAtual": "senhaAtual123",
  "novaSenha": "NovaSenhaForte123!"
}
```

**Response** (200):

```json
{
  "mensagem": "Senha alterada com sucesso"
}
```

---

## 👥 Usuários

### Tipos de Usuários

- `COORDENADOR` - Acesso completo ao sistema
- `ALUNO` - Acesso limitado para gerenciar pacientes atribuídos
- `PACIENTE` - Acesso apenas aos seus próprios dados

---

## 🏥 Pacientes

### Criar Paciente

**Endpoint**: `POST /api/pacientes`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "id_usuario": 3,
  "numero_identificacao": "12345678901",
  "data_nascimento": "1990-05-15",
  "genero": "M",
  "endereco": "Rua Principal, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "historico_medico": "Histórico de hipertensão",
  "alergias": "Penicilina"
}
```

**Response** (201):

```json
{
  "mensagem": "Paciente criado com sucesso",
  "paciente": {
    "id_paciente": 1,
    "id_usuario": 3,
    "numero_identificacao": "12345678901",
    "data_nascimento": "1990-05-15T00:00:00Z",
    "genero": "M",
    "endereco": "Rua Principal, 123",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "historico_medico": "Histórico de hipertensão",
    "alergias": "Penicilina",
    "data_registro": "2024-03-23T10:30:00Z",
    "usuario": {
      "id_usuario": 3,
      "nome": "João Santos",
      "email": "joao@farmacia.com",
      "telefone": "11987654321"
    }
  }
}
```

### Listar Pacientes

**Endpoint**: `GET /api/pacientes?skip=0&take=10`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "pacientes": [
    {
      "id_paciente": 1,
      "id_usuario": 3,
      "numero_identificacao": "12345678901",
      "data_nascimento": "1990-05-15T00:00:00Z",
      "genero": "M",
      "endereco": "Rua Principal, 123",
      "cidade": "São Paulo",
      "estado": "SP",
      "cep": "01234-567",
      "historico_medico": "Histórico de hipertensão",
      "alergias": "Penicilina",
      "data_registro": "2024-03-23T10:30:00Z",
      "usuario": {
        "id_usuario": 3,
        "nome": "João Santos",
        "email": "joao@farmacia.com",
        "telefone": "11987654321"
      },
      "tratamentos": []
    }
  ],
  "total": 1
}
```

### Obter Paciente por ID

**Endpoint**: `GET /api/pacientes/:id`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "id_paciente": 1,
  "id_usuario": 3,
  "numero_identificacao": "12345678901",
  "data_nascimento": "1990-05-15T00:00:00Z",
  "genero": "M",
  "endereco": "Rua Principal, 123",
  "cidade": "São Paulo",
  "estado": "SP",
  "cep": "01234-567",
  "historico_medico": "Histórico de hipertensão",
  "alergias": "Penicilina",
  "data_registro": "2024-03-23T10:30:00Z",
  "usuario": {
    "id_usuario": 3,
    "nome": "João Santos",
    "email": "joao@farmacia.com",
    "telefone": "11987654321",
    "ativo": true
  },
  "tratamentos": []
}
```

### Atualizar Paciente

**Endpoint**: `PUT /api/pacientes/:id`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "endereco": "Avenida Secundária, 456",
  "alergias": "Penicilina, Aspirina"
}
```

**Response** (200):

```json
{
  "mensagem": "Paciente atualizado com sucesso",
  "paciente": {
    "id_paciente": 1,
    "id_usuario": 3,
    "numero_identificacao": "12345678901",
    "data_nascimento": "1990-05-15T00:00:00Z",
    "genero": "M",
    "endereco": "Avenida Secundária, 456",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567",
    "historico_medico": "Histórico de hipertensão",
    "alergias": "Penicilina, Aspirina",
    "data_registro": "2024-03-23T10:30:00Z",
    "usuario": {
      "id_usuario": 3,
      "nome": "João Santos",
      "email": "joao@farmacia.com",
      "telefone": "11987654321"
    }
  }
}
```

### Excluir Paciente

**Endpoint**: `DELETE /api/pacientes/:id`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "mensagem": "Paciente excluído com sucesso"
}
```

---

## 💊 Medicamentos

### Criar Medicamento

**Endpoint**: `POST /api/medicamentos`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "nome_medicamento": "Losartana 50mg",
  "principio_ativo": "Losartana Potássica",
  "dosagem": "50mg",
  "apresentacao": "Comprimido",
  "fabricante": "Laboratório X",
  "lote": "LT001",
  "data_validade": "2025-12-31",
  "descricao": "Medicamento para hipertensão",
  "efeitos_colaterais": "Tontura, fraqueza"
}
```

**Response** (201):

```json
{
  "mensagem": "Medicamento criado com sucesso",
  "medicamento": {
    "id_medicamento": 1,
    "nome_medicamento": "Losartana 50mg",
    "principio_ativo": "Losartana Potássica",
    "dosagem": "50mg",
    "apresentacao": "Comprimido",
    "fabricante": "Laboratório X",
    "lote": "LT001",
    "data_validade": "2025-12-31T00:00:00Z",
    "descricao": "Medicamento para hipertensão",
    "efeitos_colaterais": "Tontura, fraqueza",
    "data_cadastro": "2024-03-23T10:30:00Z",
    "ativo": true
  }
}
```

### Listar Medicamentos Ativos

**Endpoint**: `GET /api/medicamentos?skip=0&take=10`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "medicamentos": [
    {
      "id_medicamento": 1,
      "nome_medicamento": "Losartana 50mg",
      "principio_ativo": "Losartana Potássica",
      "dosagem": "50mg",
      "apresentacao": "Comprimido",
      "fabricante": "Laboratório X",
      "lote": "LT001",
      "data_validade": "2025-12-31T00:00:00Z",
      "descricao": "Medicamento para hipertensão",
      "efeitos_colaterais": "Tontura, fraqueza",
      "data_cadastro": "2024-03-23T10:30:00Z",
      "ativo": true
    }
  ],
  "total": 1
}
```

### Buscar Medicamento

**Endpoint**: `GET /api/medicamentos/buscar?termo=losartana`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
[
  {
    "id_medicamento": 1,
    "nome_medicamento": "Losartana 50mg",
    "principio_ativo": "Losartana Potássica",
    "dosagem": "50mg",
    "apresentacao": "Comprimido",
    "fabricante": "Laboratório X",
    "lote": "LT001",
    "data_validade": "2025-12-31T00:00:00Z",
    "descricao": "Medicamento para hipertensão",
    "efeitos_colaterais": "Tontura, fraqueza",
    "data_cadastro": "2024-03-23T10:30:00Z",
    "ativo": true
  }
]
```

### Obter Medicamento por ID

**Endpoint**: `GET /api/medicamentos/:id`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "id_medicamento": 1,
  "nome_medicamento": "Losartana 50mg",
  "principio_ativo": "Losartana Potássica",
  "dosagem": "50mg",
  "apresentacao": "Comprimido",
  "fabricante": "Laboratório X",
  "lote": "LT001",
  "data_validade": "2025-12-31T00:00:00Z",
  "descricao": "Medicamento para hipertensão",
  "efeitos_colaterais": "Tontura, fraqueza",
  "data_cadastro": "2024-03-23T10:30:00Z",
  "ativo": true,
  "tratamentos": []
}
```

### Atualizar Medicamento

**Endpoint**: `PUT /api/medicamentos/:id`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "lote": "LT002",
  "data_validade": "2026-12-31"
}
```

**Response** (200):

```json
{
  "mensagem": "Medicamento atualizado com sucesso",
  "medicamento": {
    "id_medicamento": 1,
    "nome_medicamento": "Losartana 50mg",
    "principio_ativo": "Losartana Potássica",
    "dosagem": "50mg",
    "apresentacao": "Comprimido",
    "fabricante": "Laboratório X",
    "lote": "LT002",
    "data_validade": "2026-12-31T00:00:00Z",
    "descricao": "Medicamento para hipertensão",
    "efeitos_colaterais": "Tontura, fraqueza",
    "data_cadastro": "2024-03-23T10:30:00Z",
    "ativo": true
  }
}
```

### Excluir Medicamento (Marcar como Inativo)

**Endpoint**: `DELETE /api/medicamentos/:id`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "mensagem": "Medicamento marcado como inativo com sucesso"
}
```

---

## 🩺 Tratamentos

### Criar Tratamento

**Endpoint**: `POST /api/tratamentos`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "id_paciente": 1,
  "id_medicamento": 1,
  "id_usuario_criador": 1,
  "data_inicio": "2024-03-23",
  "data_fim": "2024-09-23",
  "frequencia": "Uma vez ao dia",
  "dosagem_prescrita": "50mg",
  "motivo_tratamento": "Controle de hipertensão",
  "instrucoes_especiais": "Tomar em jejum"
}
```

**Response** (201):

```json
{
  "mensagem": "Tratamento criado com sucesso",
  "tratamento": {
    "id_tratamento": 1,
    "id_paciente": 1,
    "id_medicamento": 1,
    "id_usuario_criador": 1,
    "data_inicio": "2024-03-23T00:00:00Z",
    "data_fim": "2024-09-23T00:00:00Z",
    "frequencia": "Uma vez ao dia",
    "dosagem_prescrita": "50mg",
    "motivo_tratamento": "Controle de hipertensão",
    "instrucoes_especiais": "Tomar em jejum",
    "status": "ATIVO",
    "data_criacao": "2024-03-23T10:30:00Z",
    "data_ultima_atualizacao": "2024-03-23T10:30:00Z",
    "paciente": {
      "id_paciente": 1,
      "usuario": {
        "nome": "João Santos",
        "email": "joao@farmacia.com"
      }
    },
    "medicamento": {
      "id_medicamento": 1,
      "nome_medicamento": "Losartana 50mg"
    },
    "usuario_criador": {
      "nome": "Admin",
      "email": "admin@farmacia.com"
    }
  }
}
```

### Listar Tratamentos

**Endpoint**: `GET /api/tratamentos?skip=0&take=10`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "tratamentos": [
    {
      "id_tratamento": 1,
      "id_paciente": 1,
      "id_medicamento": 1,
      "id_usuario_criador": 1,
      "data_inicio": "2024-03-23T00:00:00Z",
      "data_fim": "2024-09-23T00:00:00Z",
      "frequencia": "Uma vez ao dia",
      "dosagem_prescrita": "50mg",
      "motivo_tratamento": "Controle de hipertensão",
      "instrucoes_especiais": "Tomar em jejum",
      "status": "ATIVO",
      "data_criacao": "2024-03-23T10:30:00Z",
      "data_ultima_atualizacao": "2024-03-23T10:30:00Z",
      "paciente": {
        "id_paciente": 1,
        "usuario": {
          "nome": "João Santos",
          "email": "joao@farmacia.com"
        }
      },
      "medicamento": {
        "id_medicamento": 1,
        "nome_medicamento": "Losartana 50mg"
      },
      "usuario_criador": {
        "nome": "Admin",
        "email": "admin@farmacia.com"
      }
    }
  ],
  "total": 1
}
```

### Listar Tratamentos por Paciente

**Endpoint**: `GET /api/tratamentos/paciente/:id_paciente`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
[
  {
    "id_tratamento": 1,
    "id_paciente": 1,
    "id_medicamento": 1,
    "id_usuario_criador": 1,
    "data_inicio": "2024-03-23T00:00:00Z",
    "data_fim": "2024-09-23T00:00:00Z",
    "frequencia": "Uma vez ao dia",
    "dosagem_prescrita": "50mg",
    "motivo_tratamento": "Controle de hipertensão",
    "instrucoes_especiais": "Tomar em jejum",
    "status": "ATIVO",
    "data_criacao": "2024-03-23T10:30:00Z",
    "data_ultima_atualizacao": "2024-03-23T10:30:00Z",
    "medicamento": {
      "id_medicamento": 1,
      "nome_medicamento": "Losartana 50mg"
    },
    "usuario_criador": {
      "nome": "Admin",
      "email": "admin@farmacia.com"
    },
    "adesoes": []
  }
]
```

### Obter Tratamento por ID

**Endpoint**: `GET /api/tratamentos/:id`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "id_tratamento": 1,
  "id_paciente": 1,
  "id_medicamento": 1,
  "id_usuario_criador": 1,
  "data_inicio": "2024-03-23T00:00:00Z",
  "data_fim": "2024-09-23T00:00:00Z",
  "frequencia": "Uma vez ao dia",
  "dosagem_prescrita": "50mg",
  "motivo_tratamento": "Controle de hipertensão",
  "instrucoes_especiais": "Tomar em jejum",
  "status": "ATIVO",
  "data_criacao": "2024-03-23T10:30:00Z",
  "data_ultima_atualizacao": "2024-03-23T10:30:00Z",
  "paciente": {
    "id_paciente": 1,
    "usuario": {
      "id_usuario": 3,
      "nome": "João Santos",
      "email": "joao@farmacia.com",
      "telefone": "11987654321"
    }
  },
  "medicamento": {
    "id_medicamento": 1,
    "nome_medicamento": "Losartana 50mg"
  },
  "usuario_criador": {
    "id_usuario": 1,
    "nome": "Admin",
    "email": "admin@farmacia.com"
  },
  "adesoes": []
}
```

### Atualizar Tratamento

**Endpoint**: `PUT /api/tratamentos/:id`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "frequencia": "Duas vezes ao dia",
  "dosagem_prescrita": "100mg",
  "status": "PAUSADO"
}
```

**Response** (200):

```json
{
  "mensagem": "Tratamento atualizado com sucesso",
  "tratamento": {
    "id_tratamento": 1,
    "id_paciente": 1,
    "id_medicamento": 1,
    "id_usuario_criador": 1,
    "data_inicio": "2024-03-23T00:00:00Z",
    "data_fim": "2024-09-23T00:00:00Z",
    "frequencia": "Duas vezes ao dia",
    "dosagem_prescrita": "100mg",
    "motivo_tratamento": "Controle de hipertensão",
    "instrucoes_especiais": "Tomar em jejum",
    "status": "PAUSADO",
    "data_criacao": "2024-03-23T10:30:00Z",
    "data_ultima_atualizacao": "2024-03-23T10:45:00Z",
    "paciente": {
      "id_paciente": 1,
      "usuario": {
        "nome": "João Santos",
        "email": "joao@farmacia.com"
      }
    },
    "medicamento": {
      "id_medicamento": 1,
      "nome_medicamento": "Losartana 50mg"
    },
    "usuario_criador": {
      "nome": "Admin",
      "email": "admin@farmacia.com"
    }
  }
}
```

### Finalizar Tratamento

**Endpoint**: `PATCH /api/tratamentos/:id/finalizar`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "mensagem": "Tratamento finalizado com sucesso",
  "tratamento": {
    "id_tratamento": 1,
    "status": "FINALIZADO",
    "data_fim": "2024-03-23T10:45:00Z"
  }
}
```

### Pausar Tratamento

**Endpoint**: `PATCH /api/tratamentos/:id/pausar`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "mensagem": "Tratamento pausado com sucesso",
  "tratamento": {
    "id_tratamento": 1,
    "status": "PAUSADO"
  }
}
```

### Retomar Tratamento

**Endpoint**: `PATCH /api/tratamentos/:id/retomar`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "mensagem": "Tratamento retomado com sucesso",
  "tratamento": {
    "id_tratamento": 1,
    "status": "ATIVO"
  }
}
```

### Obter Estatísticas de Tratamentos

**Endpoint**: `GET /api/tratamentos/estatisticas/resume`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "total": 15,
  "ativos": 10,
  "pausados": 3,
  "finalizados": 2
}
```

### Excluir Tratamento

**Endpoint**: `DELETE /api/tratamentos/:id`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "mensagem": "Tratamento excluído com sucesso"
}
```

---

## 📋 Adesões

### Registrar Adesão

**Endpoint**: `POST /api/adesoes`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "id_tratamento": 1,
  "id_paciente": 1,
  "data_prevista": "2024-03-24T08:00:00Z"
}
```

**Response** (201):

```json
{
  "mensagem": "Adesão criada com sucesso",
  "adesao": {
    "id_adesao": 1,
    "id_tratamento": 1,
    "id_paciente": 1,
    "data_prevista": "2024-03-24T08:00:00Z",
    "data_tomada": null,
    "status": "PENDENTE",
    "observacoes": null,
    "registrado_em": "2024-03-23T10:30:00Z",
    "tratamento": {
      "id_tratamento": 1,
      "medicamento": {
        "nome_medicamento": "Losartana 50mg"
      }
    },
    "paciente": {
      "usuario": {
        "nome": "João Santos",
        "email": "joao@farmacia.com"
      }
    }
  }
}
```

### Listar Adesões

**Endpoint**: `GET /api/adesoes?skip=0&take=10`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "adesoes": [
    {
      "id_adesao": 1,
      "id_tratamento": 1,
      "id_paciente": 1,
      "data_prevista": "2024-03-24T08:00:00Z",
      "data_tomada": null,
      "status": "PENDENTE",
      "observacoes": null,
      "registrado_em": "2024-03-23T10:30:00Z",
      "tratamento": {
        "id_tratamento": 1,
        "medicamento": {
          "nome_medicamento": "Losartana 50mg"
        }
      },
      "paciente": {
        "usuario": {
          "nome": "João Santos",
          "email": "joao@farmacia.com"
        }
      }
    }
  ],
  "total": 1
}
```

### Listar Adesões por Paciente

**Endpoint**: `GET /api/adesoes/paciente/:id_paciente?skip=0&take=10`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "adesoes": [
    {
      "id_adesao": 1,
      "id_tratamento": 1,
      "id_paciente": 1,
      "data_prevista": "2024-03-24T08:00:00Z",
      "data_tomada": null,
      "status": "PENDENTE",
      "observacoes": null,
      "registrado_em": "2024-03-23T10:30:00Z",
      "tratamento": {
        "id_tratamento": 1,
        "medicamento": {
          "nome_medicamento": "Losartana 50mg"
        }
      }
    }
  ],
  "total": 1
}
```

### Obter Adesão por ID

**Endpoint**: `GET /api/adesoes/:id`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "id_adesao": 1,
  "id_tratamento": 1,
  "id_paciente": 1,
  "data_prevista": "2024-03-24T08:00:00Z",
  "data_tomada": null,
  "status": "PENDENTE",
  "observacoes": null,
  "registrado_em": "2024-03-23T10:30:00Z",
  "tratamento": {
    "id_tratamento": 1,
    "medicamento": {
      "nome_medicamento": "Losartana 50mg"
    },
    "paciente": {
      "usuario": {
        "nome": "João Santos",
        "email": "joao@farmacia.com"
      }
    }
  }
}
```

### Atualizar Adesão

**Endpoint**: `PUT /api/adesoes/:id`

**Headers**:

```
Authorization: Bearer seu_token
Content-Type: application/json
```

**Request**:

```json
{
  "status": "TOMADO",
  "data_tomada": "2024-03-24T08:30:00Z",
  "observacoes": "Paciente tomou conforme prescrito"
}
```

**Response** (200):

```json
{
  "mensagem": "Adesão atualizada com sucesso",
  "adesao": {
    "id_adesao": 1,
    "id_tratamento": 1,
    "id_paciente": 1,
    "data_prevista": "2024-03-24T08:00:00Z",
    "data_tomada": "2024-03-24T08:30:00Z",
    "status": "TOMADO",
    "observacoes": "Paciente tomou conforme prescrito",
    "registrado_em": "2024-03-23T10:30:00Z",
    "tratamento": {
      "id_tratamento": 1,
      "medicamento": {
        "nome_medicamento": "Losartana 50mg"
      }
    }
  }
}
```

### Marcar como Tomado

**Endpoint**: `PATCH /api/adesoes/:id/marcar-tomado`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "mensagem": "Medicamento marcado como tomado",
  "adesao": {
    "id_adesao": 1,
    "status": "TOMADO",
    "data_tomada": "2024-03-24T10:30:00Z",
    "tratamento": {
      "id_tratamento": 1,
      "medicamento": {
        "nome_medicamento": "Losartana 50mg"
      }
    }
  }
}
```

### Obter Estatísticas de Adesão

**Endpoint**: `GET /api/adesoes/estatisticas/resume?id_paciente=1`

**Headers**:

```
Authorization: Bearer seu_token
```

**Response** (200):

```json
{
  "total": 30,
  "tomados": 25,
  "pendentes": 3,
  "perdidos": 1,
  "adiados": 1,
  "taxa_adesao": 83.33
}
```

---

## 📊 Códigos de Status HTTP

| Código | Significado           | Descrição                       |
| ------ | --------------------- | ------------------------------- |
| 200    | OK                    | Requisição bem-sucedida         |
| 201    | Created               | Recurso criado com sucesso      |
| 400    | Bad Request           | Dados inválidos ou faltando     |
| 401    | Unauthorized          | Token não fornecido ou inválido |
| 403    | Forbidden             | Acesso negado                   |
| 404    | Not Found             | Recurso não encontrado          |
| 500    | Internal Server Error | Erro no servidor                |

---

## 🔗 Fluxo Completo de Exemplo

### 1. Registrar e Fazer Login

```bash
# Registrar
curl -X POST http://localhost:3001/api/auth/registrar \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Dr. Silva",
    "email": "silva@example.com",
    "senha": "SenhaForte123!",
    "tipo_usuario": "COORDENADOR"
  }'

# Login
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "silva@example.com",
    "senha": "SenhaForte123!"
  }'
```

### 2. Criar Paciente

```bash
curl -X POST http://localhost:3001/api/pacientes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_usuario": 3,
    "numero_identificacao": "12345678901",
    "data_nascimento": "1990-01-15",
    "genero": "M",
    "alergias": "Penicilina"
  }'
```

### 3. Criar Medicamento

```bash
curl -X POST http://localhost:3001/api/medicamentos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome_medicamento": "Losartana 50mg",
    "principio_ativo": "Losartana Potássica",
    "dosagem": "50mg",
    "apresentacao": "Comprimido"
  }'
```

### 4. Criar Tratamento

```bash
curl -X POST http://localhost:3001/api/tratamentos \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_paciente": 1,
    "id_medicamento": 1,
    "id_usuario_criador": 1,
    "data_inicio": "2024-03-23",
    "frequencia": "Uma vez ao dia",
    "motivo_tratamento": "Hipertensão"
  }'
```

### 5. Registrar Adesão

```bash
curl -X POST http://localhost:3001/api/adesoes \
  -H "Authorization: Bearer SEU_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "id_tratamento": 1,
    "id_paciente": 1,
    "data_prevista": "2024-03-24T08:00:00Z"
  }'
```

---

**Versão**: 1.0.0  
**Última atualização**: Março 23, 2026
