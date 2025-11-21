import React, { useCallback, useState } from 'react';

import { router } from 'expo-router';
import { ActivityIndicator, Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BACKEND_URL = 'https://unlawyerlike-renee-splashily.ngrok-free.dev';

async function registrarEstudiante(nombre: string, email: string, contrasena: string, universidad: string) {  const datosRegistro = {
    nombre,
    email,
    contrasena,
    universidad
  };

  try {
    const response = await fetch(`${BACKEND_URL}/usuarios/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(datosRegistro),
    });

    const data = await response.json();

    if (response.ok) { 
      return data.usuario;
    } else {
      const errorDetail = data.detail || data.mensaje || "Error desconocido en el servidor";
      throw new Error(errorDetail); 
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`Error de red o servidor: ${message}`);
  }
}

export default function RegisterScreen() {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [confirmarContrasena, setConfirmarContrasena] = useState('');
  const [universidad, setUniversidad] = useState('');
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
      
      Alert.alert("Éxito", `¡Registro completo!`, [
        { text: "OK", onPress: () => router.replace('/dashboard') } 
      ]);

    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      Alert.alert("Fallo en el registro", message);
    } finally {
      setCargando(false);
    }
  }, [nombre, email, contrasena, confirmarContrasena, universidad]);


  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F4B000',
        paddingHorizontal: 30,
        paddingTop: 10,
      }}
    >
      {/* TÍTULO */}
      <Text style={{ fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 40, }}> AhorraU </Text>
      <Text style={{ fontSize: 26, fontWeight: 'bold', marginBottom: 30, }}> Crear cuenta </Text>

      {/* NOMBRE COMPLETO */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}> Nombre completo </Text>
      <TextInput
        placeholder="Ej: Juan Pérez"
        onChangeText={setNombre} // <-- MODIFICACIÓN: Enlazar estado
        value={nombre}         // <-- MODIFICACIÓN: Enlazar estado
        style={{ borderWidth: 1, borderColor: '#000', padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 20, }}
      />

      {/* CORREO */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}> Correo </Text>
      <TextInput
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        onChangeText={setEmail}
        value={email}
        style={{ borderWidth: 1, borderColor: '#000', padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 20, }}
      />

      {/* CONTRASEÑA */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}> Contraseña </Text>
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        onChangeText={setContrasena}
        value={contrasena}
        style={{ borderWidth: 1, borderColor: '#000', padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 20, }}
      />

      {/* REPETIR CONTRASEÑA */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}> Repetir contraseña </Text>
      <TextInput
        placeholder="Repetir contraseña"
        secureTextEntry
        onChangeText={setConfirmarContrasena}
        value={confirmarContrasena}
        style={{ borderWidth: 1, borderColor: '#000', padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 20, }}
      />

      {/* UNIVERSIDAD */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}> Universidad </Text>
      <TextInput
        placeholder="Ej: Universidad Nacional"
        onChangeText={setUniversidad}
        value={universidad}
        style={{ borderWidth: 1, borderColor: '#000', padding: 12, borderRadius: 12, backgroundColor: 'white', marginBottom: 30, }}
      />

      {/* BOTÓN REGISTRAR */}
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          paddingVertical: 14,
          borderRadius: 12,
          opacity: cargando ? 0.7 : 1
        }}
        onPress={cargando ? () => {} : handleRegister}
        disabled={cargando}
      >
        {cargando ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text
            style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', fontSize: 16, }}
          >
            Registrar
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}