import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BACKEND_URL = "https://skinlike-clutchingly-hyun.ngrok-free.dev";

//  Registrar estudiante con respuesta correcta y guardado en AsyncStorage
async function registrarEstudiante(
  nombre: string,
  email: string,
  contrasena: string,
  universidad: string
): Promise<any> {
  const datosRegistro = { nombre, email, contrasena, universidad };

  const response = await fetch(`${BACKEND_URL}/usuarios/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datosRegistro),
  });

  const raw = await response.text();

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    throw new Error(`Servidor devolvió algo que NO es JSON: ${raw}`);
  }

  if (!response.ok) {
    throw new Error(data.detail || "Error en registro.");
  }

  // Guardar datos del usuario en async storage (nuevo formato correcto)
  await AsyncStorage.setItem("nombre", data.usuario.nombre);
  await AsyncStorage.setItem("usuario_id", String(data.usuario.id));
  await AsyncStorage.setItem("universidad", data.usuario.universidad || "");
  await AsyncStorage.setItem("token", data.token || "");

  return data.usuario;
}

export default function RegisterScreen() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [confirmarContrasena, setConfirmarContrasena] = useState("");
  const [universidad, setUniversidad] = useState("");
  const [cargando, setCargando] = useState(false);

  const handleRegister = useCallback(async () => {
    if (!nombre || !email || !contrasena || !confirmarContrasena || !universidad) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    if (contrasena !== confirmarContrasena) {
      Alert.alert("Error", "Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);

    try {
      await registrarEstudiante(nombre, email, contrasena, universidad);

      Alert.alert("Éxito", "¡Registro exitoso!", [
        { text: "OK", onPress: () => router.replace("/dashboard") },
      ]);
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Error desconocido";
      Alert.alert("Fallo en el registro", message);
    } finally {
      setCargando(false);
    }
  }, [nombre, email, contrasena, confirmarContrasena, universidad]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#F4B000",
        paddingHorizontal: 30,
        paddingTop: 10,
      }}
    >
      <Text style={{ fontSize: 32, fontWeight: "bold", color: "white", marginBottom: 40 }}>
        AhorraU
      </Text>

      <Text style={{ fontSize: 26, fontWeight: "bold", marginBottom: 30 }}>
        Crear cuenta
      </Text>

      {/* NOMBRE */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "bold" }}>
        Nombre completo
      </Text>
      <TextInput
        placeholder="Ej: Juan Pérez"
        value={nombre}
        onChangeText={setNombre}
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 12,
          borderRadius: 12,
          backgroundColor: "white",
          marginBottom: 20,
        }}
      />

      {/* EMAIL */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "bold" }}>
        Correo
      </Text>
      <TextInput
        placeholder="Correo electrónico"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 12,
          borderRadius: 12,
          backgroundColor: "white",
          marginBottom: 20,
        }}
      />

      {/* CONTRASEÑA */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "bold" }}>
        Contraseña
      </Text>
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        value={contrasena}
        onChangeText={setContrasena}
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 12,
          borderRadius: 12,
          backgroundColor: "white",
          marginBottom: 20,
        }}
      />

      {/* CONFIRMAR CONTRASEÑA */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "bold" }}>
        Repetir contraseña
      </Text>
      <TextInput
        placeholder="Repetir contraseña"
        secureTextEntry
        value={confirmarContrasena}
        onChangeText={setConfirmarContrasena}
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 12,
          borderRadius: 12,
          backgroundColor: "white",
          marginBottom: 20,
        }}
      />

      {/* UNIVERSIDAD */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: "bold" }}>
        Universidad
      </Text>
      <TextInput
        placeholder="Ej: Universidad Nacional"
        value={universidad}
        onChangeText={setUniversidad}
        style={{
          borderWidth: 1,
          borderColor: "#000",
          padding: 12,
          borderRadius: 12,
          backgroundColor: "white",
          marginBottom: 30,
        }}
      />

      {/* BOTÓN REGISTRO */}
      <TouchableOpacity
        style={{
          backgroundColor: "#000",
          paddingVertical: 14,
          borderRadius: 12,
          opacity: cargando ? 0.7 : 1,
        }}
        onPress={cargando ? () => {} : handleRegister}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{
              color: "white",
              textAlign: "center",
              fontWeight: "bold",
              fontSize: 16,
            }}
          >
            Registrar
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}
