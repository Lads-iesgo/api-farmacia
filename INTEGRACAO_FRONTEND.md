# 🔗 Integração Frontend - API Farmácia

Exemplos de como consumir a API no frontend React Native/Expo.

## 📦 Configuração Inicial

### 1. Chamar API Service

Crie um arquivo `src/services/api.ts`:

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_BASE_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

// Interceptor para adicionar token automaticamente
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor para tratar erros
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expirado, fazer logout
      await AsyncStorage.removeItem('authToken');
      // Redirecionar para login
    }
    return Promise.reject(error);
  }
);

export default api;
```

## 🔐 Autenticação

### Login

```typescript
import api from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const fazerLogin = async (email: string, senha: string) => {
  try {
    const response = await api.post('/auth/login', { email, senha });
    
    // Salvar token
    await AsyncStorage.setItem('authToken', response.data.token);
    
    // Salvar dados do usuário
    await AsyncStorage.setItem(
      'usuario',
      JSON.stringify(response.data.usuario)
    );
    
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao fazer login');
  }
};
```

### Registrar

```typescript
export const registrarUsuario = async (
  nome: string,
  email: string,
  senha: string,
  tipoUsuario: string
) => {
  try {
    const response = await api.post('/auth/registrar', {
      nome,
      email,
      senha,
      tipo_usuario: tipoUsuario,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao registrar');
  }
};
```

### Logout

```typescript
export const fazerLogout = async () => {
  await AsyncStorage.removeItem('authToken');
  await AsyncStorage.removeItem('usuario');
};
```

## 👥 Gerenciar Pacientes

### Listar Pacientes

```typescript
export const listarPacientes = async (skip = 0, take = 10) => {
  try {
    const response = await api.get('/pacientes', {
      params: { skip, take },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao listar pacientes');
  }
};
```

### Criar Paciente

```typescript
export const criarPaciente = async (
  idUsuario: number,
  numeroIdentificacao: string,
  dados?: any
) => {
  try {
    const response = await api.post('/pacientes', {
      id_usuario: idUsuario,
      numero_identificacao: numeroIdentificacao,
      ...dados,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao criar paciente');
  }
};
```

### Obter Detalhes do Paciente

```typescript
export const obterPaciente = async (idPaciente: number) => {
  try {
    const response = await api.get(`/pacientes/${idPaciente}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao obter paciente');
  }
};
```

### Atualizar Paciente

```typescript
export const atualizarPaciente = async (
  idPaciente: number,
  dados: any
) => {
  try {
    const response = await api.put(`/pacientes/${idPaciente}`, dados);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao atualizar paciente');
  }
};
```

## 💊 Gerenciar Medicamentos

### Buscar Medicamentos

```typescript
export const buscarMedicamentos = async (termo: string) => {
  try {
    const response = await api.get('/medicamentos/buscar', {
      params: { termo },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao buscar medicamentos');
  }
};
```

### Listar Todos os Medicamentos

```typescript
export const listarMedicamentos = async (skip = 0, take = 50) => {
  try {
    const response = await api.get('/medicamentos', {
      params: { skip, take },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao listar medicamentos');
  }
};
```

### Criar Medicamento

```typescript
export const criarMedicamento = async (dados: any) => {
  try {
    const response = await api.post('/medicamentos', dados);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao criar medicamento');
  }
};
```

## 🩺 Gerenciar Tratamentos

### Listar Tratamentos do Paciente

```typescript
export const listarTratamentosPaciente = async (idPaciente: number) => {
  try {
    const response = await api.get(`/tratamentos/paciente/${idPaciente}`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao listar tratamentos');
  }
};
```

### Criar Tratamento

```typescript
export const criarTratamento = async (
  idPaciente: number,
  idMedicamento: number,
  idUsuarioCriador: number,
  dataInicio: Date,
  frequencia: string,
  dados?: any
) => {
  try {
    const response = await api.post('/tratamentos', {
      id_paciente: idPaciente,
      id_medicamento: idMedicamento,
      id_usuario_criador: idUsuarioCriador,
      data_inicio: dataInicio.toISOString(),
      frequencia,
      ...dados,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao criar tratamento');
  }
};
```

### Pausar Tratamento

```typescript
export const pausarTratamento = async (idTratamento: number) => {
  try {
    const response = await api.patch(`/tratamentos/${idTratamento}/pausar`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao pausar tratamento');
  }
};
```

### Finalizar Tratamento

```typescript
export const finalizarTratamento = async (idTratamento: number) => {
  try {
    const response = await api.patch(`/tratamentos/${idTratamento}/finalizar`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao finalizar tratamento');
  }
};
```

### Obter Estatísticas

```typescript
export const obterEstatisticasTratamentos = async () => {
  try {
    const response = await api.get('/tratamentos/estatisticas/resume');
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao obter estatísticas');
  }
};
```

## 📋 Gerenciar Adesões

### Registrar Adesão

```typescript
export const registrarAdesao = async (
  idTratamento: number,
  idPaciente: number,
  dataPrevista: Date
) => {
  try {
    const response = await api.post('/adesoes', {
      id_tratamento: idTratamento,
      id_paciente: idPaciente,
      data_prevista: dataPrevista.toISOString(),
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao registrar adesão');
  }
};
```

### Listar Adesões do Paciente

```typescript
export const listarAdesoesPaciente = async (
  idPaciente: number,
  skip = 0,
  take = 10
) => {
  try {
    const response = await api.get(`/adesoes/paciente/${idPaciente}`, {
      params: { skip, take },
    });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao listar adesões');
  }
};
```

### Marcar como Tomado

```typescript
export const marcarAdesaoTomada = async (idAdesao: number) => {
  try {
    const response = await api.patch(`/adesoes/${idAdesao}/marcar-tomado`);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao marcar como tomado');
  }
};
```

### Obter Taxa de Adesão

```typescript
export const obterTaxaAdesao = async (idPaciente?: number) => {
  try {
    const params = idPaciente ? { id_paciente: idPaciente } : {};
    const response = await api.get('/adesoes/estatisticas/resume', { params });
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.erro || 'Erro ao obter taxas');
  }
};
```

## 🎯 Exemplo de Tela de Login

```typescript
import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { fazerLogin } from '../services/authService';

export default function LoginScreen({ navigation }: any) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleLogin = async () => {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    try {
      setCarregando(true);
      const resultado = await fazerLogin(email, senha);
      
      // Sucesso! Navegar para home
      navigation.replace('Home', { usuario: resultado.usuario });
    } catch (error: any) {
      Alert.alert('Erro', error.message);
    } finally {
      setCarregando(false);
    }
  };

  return (
    <View style={{ flex: 1, padding: 20, justifyContent: 'center' }}>
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        editable={!carregando}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      
      <TextInput
        placeholder="Senha"
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        editable={!carregando}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      
      <TouchableOpacity
        onPress={handleLogin}
        disabled={carregando}
        style={{
          backgroundColor: '#007AFF',
          padding: 15,
          borderRadius: 8,
          opacity: carregando ? 0.6 : 1,
        }}
      >
        <Text style={{ color: '#FFF', textAlign: 'center', fontSize: 16 }}>
          {carregando ? 'Entrando...' : 'Login'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
```

## 🎯 Exemplo de Tela de Pacientes

```typescript
import React, { useEffect, useState } from 'react';
import { View, FlatList, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import { listarPacientes, obterPaciente } from '../services/pacienteService';

export default function PacientesScreen() {
  const [pacientes, setPacientes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    carregarPacientes();
  }, []);

  const carregarPacientes = async () => {
    try {
      setCarregando(true);
      const response = await listarPacientes(0, 10);
      setPacientes(response.pacientes);
    } catch (error) {
      console.error('Erro ao carregar pacientes:', error);
    } finally {
      setCarregando(false);
    }
  };

  if (carregando) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id_paciente.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={{
              padding: 15,
              borderBottomWidth: 1,
              borderBottomColor: '#e0e0e0',
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: 'bold' }}>
              {item.usuario.nome}
            </Text>
            <Text style={{ color: '#666' }}>
              {item.numero_identificacao}
            </Text>
            <Text style={{ color: '#999', fontSize: 12 }}>
              {item.tratamentos.length} tratamentos
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
```

## 🔄 Context API para Estado Global

```typescript
import React, { createContext, useState, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  usuario: any;
  token: string | null;
  login: (email: string, senha: string) => Promise<void>;
  logout: () => Promise<void>;
  carregando: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: any) {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState<string | null>(null);
  const [carregando, setCarregando] = useState(true);

  React.useEffect(() => {
    // Verificar se há token salvo ao iniciar
    carregarSessionSalva();
  }, []);

  const carregarSessionSalva = async () => {
    try {
      const tokenSalvo = await AsyncStorage.getItem('authToken');
      const usuarioSalvo = await AsyncStorage.getItem('usuario');
      
      if (tokenSalvo && usuarioSalvo) {
        setToken(tokenSalvo);
        setUsuario(JSON.parse(usuarioSalvo));
      }
    } finally {
      setCarregando(false);
    }
  };

  const login = async (email: string, senha: string) => {
    const resultado = await fazerLogin(email, senha);
    setToken(resultado.token);
    setUsuario(resultado.usuario);
  };

  const logout = async () => {
    await fazerLogout();
    setToken(null);
    setUsuario(null);
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, carregando }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }
  return context;
}
```

## 🚀 Boas Práticas

1. **Sempre verificar token antes de requisições**
2. **Usar AsyncStorage para persistir dados**
3. **Implementar retry logic para conexões instáveis**
4. **Mostrar loader enquanto aguarda resposta**
5. **Tratar erros graciosamente**
6. **Usar Context/Redux para estado global**
7. **Validar dados antes de enviar**

## 📝 Notas

- A API retorna erros em português (português do Brasil)
- Datas são retornadas como ISO strings (converter com `new Date()`)
- Todos os endpoints requerem autenticação (exceto `/auth/*` públicos)
- CORS está configurado para `http://localhost:8081`

---

**Pronto! Você tem tudo para integrar a API no seu frontend! 🎯**
