import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL = "https://skinlike-clutchingly-hyun.ngrok-free.dev";

export const unstable_settings = {
  headerShown: false
};

export default function CalcularGastos() {
  const [gastoSemanal, setGastoSemanal] = useState("");
  const [metaGasto, setMetaGasto] = useState("");
  const [loading, setLoading] = useState(false);

  const calcularEnBackend = async () => {
    setLoading(true);

    try {
      const id = await AsyncStorage.getItem("usuario_id");

      if (!id) {
        Alert.alert("Error", "No se encontró el usuario_id.");
        return;
      }

      const usuario_id = Number(id);

      // LLAMAR AL ENDPOINT CORRECTO
      const response = await fetch(`${BACKEND_URL}/calcular-escenario`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          usuario_id,
          gasto_actual: Number(gastoSemanal),
          meta: Number(metaGasto),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Error en el cálculo");
      }

      // ENVIAR DATOS A GASTOSTOTALES
      router.push({
        pathname: "/gastosTotales",
        params: { resultado: JSON.stringify(data) },
      });

    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const onConfirm = () => {
    if (!gastoSemanal || !metaGasto) {
      Alert.alert("Campos incompletos", "Completa ambos campos.");
      return;
    }

    if (Number(metaGasto) >= Number(gastoSemanal)) {
      Alert.alert("Meta inválida", "La meta debe ser menor al gasto actual.");
      return;
    }

    calcularEnBackend();
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: stylesVars.bg }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Calcular mis gastos</Text>

        <Text style={styles.label}>Tu gasto semanal</Text>
        <TextInput
          placeholder="S/. 0"
          keyboardType="numeric"
          value={gastoSemanal}
          onChangeText={setGastoSemanal}
          style={styles.input}
        />

        <Text style={[styles.label, { marginTop: 16 }]}>
          Cuánto quieres gastar (S/.)
        </Text>
        <TextInput
          placeholder="S/. 0"
          keyboardType="numeric"
          value={metaGasto}
          onChangeText={setMetaGasto}
          style={styles.input}
        />

        <TouchableOpacity
          style={[styles.confirmButton, loading && { opacity: 0.7 }]}
          onPress={loading ? () => {} : onConfirm}
        >
          {loading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text style={styles.confirmText}>Confirmar</Text>
          )}
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const stylesVars = {
  bg: "#F6B400",
  black: "#000",
  white: "#fff",
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 25,
    paddingTop: 60,
    paddingBottom: 40,
    minHeight: "100%",
    backgroundColor: stylesVars.bg,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 30,
    color: stylesVars.black,
  },
  label: {
    fontWeight: "700",
    marginBottom: 8,
    color: stylesVars.black,
  },
  input: {
    backgroundColor: stylesVars.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: stylesVars.black,
    fontWeight: "700",
  },
  confirmButton: {
    backgroundColor: stylesVars.white,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 26,
  },
  confirmText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: stylesVars.black,
  },
});
