import { router } from 'expo-router';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
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

      <Text style={{ fontSize: 16, marginBottom: 6 }}>Ingrese un correo</Text>
      <TextInput
        placeholder="ejemplo@gmail.com"
        autoCapitalize="none"
        keyboardType="email-address"
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 20,
          fontWeight: 'bold',
        }}
      />

      <Text style={{ fontSize: 16, marginBottom: 6 }}>Ingrese su contraseña</Text>
      <TextInput
        placeholder="********"
        secureTextEntry
        style={{
          borderWidth: 1,
          borderColor: '#000',
          padding: 12,
          borderRadius: 12,
          backgroundColor: 'white',
          marginBottom: 5,
          fontWeight: 'bold',
        }}
      />
      
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
          eres nuevo? registrate!!
        </Text>
      </TouchableOpacity>

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
