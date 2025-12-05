import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, Text, TextInput, TouchableOpacity, View } from 'react-native';

const BACKEND_URL = "https://skinlike-clutchingly-hyun.ngrok-free.dev";

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [errors, setErrors] = useState({
    email: '',
    password: ''
  });

  // ---------------- VALIDACIONES ----------------
  const validate = () => {
    let valid = true;
    let tempErrors = { email: '', password: '' };

    if (!email.trim()) {
      tempErrors.email = 'El correo es obligatorio';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      tempErrors.email = 'Ingrese un correo válido';
      valid = false;
    }

    if (!password.trim()) {
      tempErrors.password = 'La contraseña es obligatoria';
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };

  // ---------------- LOGIN AL BACKEND ----------------
  const handleLogin = async () => {
    if (!validate()) return;

    try {
      const response = await fetch(`${BACKEND_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const rawText = await response.text();
      let data;

      try {
        data = JSON.parse(rawText);
      } catch {
        Alert.alert("Error", `Respuesta inválida del servidor: ${rawText}`);
        return;
      }

      // Convertir arrays a string para evitar el crash
      if (Array.isArray(data.detail)) {
        data.detail = data.detail.join(", ");
      }

      if (!response.ok) {
        const msg = data.detail || data.mensaje || "Credenciales incorrectas";
        Alert.alert("Error", String(msg));
        return;
      }

      // Guardar datos importantes
      await AsyncStorage.setItem("token", String(data.token));
      await AsyncStorage.setItem("usuario_id", String(data.usuario_id));
      await AsyncStorage.setItem("nombre", String(data.nombre || "")); 
      await AsyncStorage.setItem("universidad", String(data.universidad || ""));

      router.replace("/dashboard");

    } catch (err) {
      Alert.alert("Error", "No se pudo conectar al servidor");
    }
  };

  // ---------------- UI ----------------
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F4B000',
        justifyContent: 'center',
        paddingHorizontal: 30,
      }}
    >

      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 120,
        }}
      >
        AhorraU
      </Text>

      <Text
        style={{
          fontSize: 30,
          fontWeight: 'bold',
          marginBottom: 100,
          textAlign: 'center',
        }}
      >
        Bienvenido
      </Text>

      {/* EMAIL */}
      <Text style={{ fontSize: 16, marginBottom: 6 }}>Ingrese un correo</Text>
      <TextInput
        placeholder="ejemplo@gmail.com"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
        style={{
          borderWidth: 1,
          borderColor: errors.email ? 'red' : '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 5,
          fontWeight: 'bold',
        }}
      />
      {errors.email ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.email}</Text>
      ) : null}

      {/* PASSWORD */}
      <Text style={{ fontSize: 16, marginBottom: 6 }}>Ingrese su contraseña</Text>
      <TextInput
        placeholder="********"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{
          borderWidth: 1,
          borderColor: errors.password ? 'red' : '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 5,
          fontWeight: 'bold',
        }}
      />
      {errors.password ? (
        <Text style={{ color: 'red', marginBottom: 10 }}>{errors.password}</Text>
      ) : null}

      <TouchableOpacity onPress={() => router.push('/registro')}>
        <Text
          style={{
            textAlign: 'center',
            textDecorationLine: 'underline',
            marginBottom: 60,
            alignSelf: 'flex-end',
            fontSize: 15,
            color: '#000',
          }}
        >
          ¿Eres nuevo? ¡Regístrate!
        </Text>
      </TouchableOpacity>

      {/* BOTÓN LOGIN */}
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          paddingVertical: 14,
          borderRadius: 12,
        }}
        onPress={handleLogin}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Ingresar
        </Text>
      </TouchableOpacity>

      <View style={{ flex: 0.8 }} />

      <TouchableOpacity
        onPress={() => router.push('/restablecer')}
        style={{ marginTop: 20 }}
      >
        <Text
          style={{
            textAlign: 'center',
            textDecorationLine: 'underline',
            color: '#000',
            fontWeight: 'bold',
            fontSize: 18,
          }}
        >
          Olvidé mi contraseña
        </Text>
      </TouchableOpacity>
    </View>
  );
}
