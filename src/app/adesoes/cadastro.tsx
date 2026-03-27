import { useRouter } from "expo-router";
import { ArrowLeft } from "lucide-react-native";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Colors } from "../_components/Colors";
import FormInput from "../_components/FormInput";
import Header from "../_components/Header";
import { useNotification } from "../_components/NotificationContext";
import SelectField from "../_components/Select";
import { converterDataParaISO, formatarDataInput } from "../_utils/formatters";
import api from "../services/api";

export default function CadastroAdesaoScreen() {
  const router = useRouter();
  const { showNotification } = useNotification();
  const [tratamentos, setTratamentos] = useState<any[]>([]);
  const [pacientes, setPacientes] = useState<any[]>([]);
  const [medicamentos, setMedicamentos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    id_tratamento: "",
    data_prevista: "",
  });

  React.useEffect(() => {
    const carregarDados = async () => {
      try {
        const AsyncStorage = (
          await import("@react-native-async-storage/async-storage")
        ).default;
        const role =
          (await AsyncStorage.getItem("@app-farmacia:userRole")) || "";
        const idStr =
          (await AsyncStorage.getItem("@app-farmacia:userId")) || "";

        const [tratResponse, pacResponse, medResponse] = await Promise.all([
          api.get("/tratamentos", { params: { skip: 0, take: 100 } }),
          api.get("/pacientes", { params: { skip: 0, take: 100 } }),
          api.get("/medicamentos", { params: { skip: 0, take: 100 } }),
        ]);

        let tratDados =
          tratResponse.data.tratamentos ||
          tratResponse.data.dados ||
          (Array.isArray(tratResponse.data) ? tratResponse.data : []);
        const pacDados =
          pacResponse.data.pacientes ||
          pacResponse.data.dados ||
          (Array.isArray(pacResponse.data) ? pacResponse.data : []);
        const medDados =
          medResponse.data.medicamentos ||
          medResponse.data.dados ||
          (Array.isArray(medResponse.data) ? medResponse.data : []);

        if (role.toUpperCase() === "PACIENTE") {
          const me = pacDados.find(
            (p: any) => String(p.id_usuario) === String(idStr),
          );
          if (me) {
            tratDados = tratDados.filter(
              (t: any) => String(t.id_paciente) === String(me.id_paciente),
            );
          } else {
            tratDados = [];
          }
        }

        setTratamentos(tratDados);
        setPacientes(pacDados);
        setMedicamentos(medDados);
      } catch (error) {
        showNotification("error", "Falha ao carregar dados do servidor");
      }
    };
    carregarDados();
  }, []);

  const handleCadastrar = async () => {
    if (!form.id_tratamento || !form.data_prevista) {
      showNotification("error", "Preencha o tratamento e a data prevista");
      return;
    }

    setLoading(true);
    try {
      const tratamentoSelecionado = tratamentos.find(
        (t) => String(t.id_tratamento) === String(form.id_tratamento),
      );

      if (!tratamentoSelecionado) {
        showNotification("error", "Tratamento inválido selecionado");
        setLoading(false);
        return;
      }

      const payload = {
        id_tratamento: Number(form.id_tratamento),
        id_paciente: Number(tratamentoSelecionado.id_paciente),
        data_prevista: converterDataParaISO(form.data_prevista),
      };

      await api.post("/adesoes", payload);

      showNotification("success", "Adesão registrada com sucesso!");
      router.push("/adesoes" as any);
    } catch (error: any) {
      const mensagem =
        error.response?.data?.erro ||
        error.response?.data?.message ||
        error.message ||
        "Falha ao registrar adesão";
      console.error("❌ Erro:", mensagem);
      showNotification("error", mensagem);
    } finally {
      setLoading(false);
    }
  };

  const tratamentosOptions = tratamentos.map((t: any) => {
    const paciente = pacientes.find(
      (p: any) => String(p.id_paciente) === String(t.id_paciente),
    );
    const medicamento = medicamentos.find(
      (m: any) => String(m.id_medicamento) === String(t.id_medicamento),
    );

    const pacienteNome =
      (paciente as any)?.usuario?.nome ||
      (paciente as any)?.nome ||
      `Paciente #${t.id_paciente}`;
    const medicamentoNome =
      (medicamento as any)?.nome_medicamento ||
      `Medicamento #${t.id_medicamento}`;

    return {
      label: `${pacienteNome} - ${medicamentoNome}`,
      value: String(t.id_tratamento),
    };
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.pageHeader}>
          <TouchableOpacity
            onPress={() => router.push("/adesoes" as any)}
            style={styles.backButton}
          >
            <ArrowLeft size={24} color={Colors.text} />
          </TouchableOpacity>
          <View>
            <Text style={styles.pageTitle}>Registrar adesão</Text>
            <Text style={styles.pageSubtitle}>
              Registre o agendamento de um medicamento
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <Text style={styles.formSectionTitle}>Detalhes da adesão</Text>

          <SelectField
            label="Tratamento *"
            placeholder="Selecione o tratamento"
            value={form.id_tratamento}
            options={tratamentosOptions}
            onSelect={(v: string) => setForm({ ...form, id_tratamento: v })}
          />

          <FormInput
            label="Data Prevista *"
            placeholder="dd/mm/aaaa"
            keyboardType="numeric"
            value={form.data_prevista}
            onChangeText={(v) =>
              setForm({ ...form, data_prevista: formatarDataInput(v) })
            }
          />

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.buttonDisabled]}
              onPress={handleCadastrar}
              disabled={loading}
            >
              <Text style={styles.submitButtonText}>
                {loading ? "Registrando..." : "Registrar"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => router.push("/adesoes" as any)}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scrollContent: { padding: 20, paddingBottom: 40 },
  pageHeader: { flexDirection: "row", alignItems: "center", marginBottom: 24 },
  backButton: { marginRight: 16 },
  pageTitle: { fontSize: 20, fontWeight: "bold", color: Colors.text },
  pageSubtitle: { fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  formSectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: Colors.text,
    marginBottom: 20,
  },
  buttonsContainer: { marginTop: 8, gap: 12 },
  submitButton: {
    backgroundColor: "#0A1833",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  submitButtonText: { color: Colors.white, fontSize: 16, fontWeight: "bold" },
  cancelButton: {
    backgroundColor: Colors.white,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cancelButtonText: { color: Colors.text, fontSize: 16, fontWeight: "bold" },
});
