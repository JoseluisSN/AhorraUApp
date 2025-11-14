import { router } from "expo-router";
import React, { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

export const unstable_settings = {
  headerShown: false,
};

export default function CalcularGastos() {
  const [gastoSemanal, setGastoSemanal] = useState("");
  const [metaGasto, setMetaGasto] = useState("");

  const onConfirm = () => {
    // aquí pondrás la lógica real (validaciones, cálculo, API, etc.)
    // por ahora mostramos un alert simple y volvemos atrás
    // alert(`Gasto semanal: ${gastoSemanal}\nMeta: ${metaGasto}`);
    router.push("/gastosTotales");
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

        <TouchableOpacity style={styles.confirmButton} onPress={onConfirm}>
          <Text style={styles.confirmText}>Confirmar</Text>
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
  back: {
    marginBottom: 10,
  },
  backText: {
    color: stylesVars.black,
    fontWeight: "600",
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
  cancelButton: {
    backgroundColor: stylesVars.black,
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  cancelText: {
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
    color: stylesVars.white,
  },
});
