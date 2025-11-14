import { router } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function OlvidoContraseñaScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#F4B000',
        paddingHorizontal: 30,
        paddingTop: 80,
      }}
    >

      <Text
        style={{
          fontSize: 32,
          fontWeight: 'bold',
          color: 'white',
          marginBottom: 40,
          textAlign: 'center',
        }}
      >
        Recuperar contraseña
      </Text>

      <Text
        style={{
          fontSize: 18,
          marginBottom: 20,
          textAlign: 'center',
          lineHeight: 24,
        }}
      >
        Ingresa el correo con el que te registraste.
        Te enviaremos un enlace para restablecer tu contraseña.
      </Text>

      <Text style={{ fontSize: 16, marginBottom: 6 }}>
        Correo registrado
      </Text>

      <TextInput
        placeholder="ejemplo@gmail.com"
        keyboardType="email-address"
        autoCapitalize="none"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 14,
          backgroundColor: 'white',
          borderRadius: 12,
          marginBottom: 40,
          fontWeight: 'bold',
        }}
      />

      <TouchableOpacity
        style={{
          backgroundColor: '#000',
          paddingVertical: 16,
          borderRadius: 12,
        }}
        onPress={() => {
          
          router.back(); 
        }}
      >
        <Text
          style={{
            color: 'white',
            textAlign: 'center',
            fontWeight: 'bold',
            fontSize: 16,
          }}
        >
          Restablecer contraseña
        </Text>
      </TouchableOpacity>

    </View>
  );
}
