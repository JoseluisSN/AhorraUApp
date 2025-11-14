import { router } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function RegisterScreen() {
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
      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 40,
        }}
      >
        AhorraU
      </Text>

      <Text
        style={{
          fontSize: 26,
          fontWeight: 'bold',
          marginBottom: 30,
        }}
      >
        Crear cuenta
      </Text>

      {/* NOMBRE COMPLETO */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}>
        Nombre completo
      </Text>
      <TextInput
        placeholder="Ej: Juan Pérez"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 20,
        }}
      />

      {/* CORREO */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}>
        Correo
      </Text>
      <TextInput
        placeholder="Correo electrónico"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 20,
        }}
      />

      {/* CONTRASEÑA */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}>
        Contraseña
      </Text>
      <TextInput
        placeholder="Contraseña"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 20,
        }}
      />

      {/* REPETIR CONTRASEÑA */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}>
        Repetir contraseña
      </Text>
      <TextInput
        placeholder="Repetir contraseña"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 20,
        }}
      />

      {/* UNIVERSIDAD */}
      <Text style={{ fontSize: 16, marginBottom: 6, fontWeight: 'bold' }}>
        Universidad
      </Text>
      <TextInput
        placeholder="Ej: Universidad Nacional"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 30,
        }}
      />

      {/* BOTÓN REGISTRAR */}
      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          paddingVertical: 14,
          borderRadius: 12,
        }}
        onPress={() => router.replace('/dashboard')}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Registrar
        </Text>
      </TouchableOpacity>
    </View>
  );
}
