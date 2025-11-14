import { router, Stack } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.container}>

        <View style={styles.header}>

          <Text style={styles.welcome}>Hola User218745!</Text>
        </View>

        <Text style={styles.question}>¿Que deseas hacer?</Text>

        <View style={styles.buttonsWrapper}>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/calcularGastos")}
          >
            <Text style={styles.buttonText}>Calcular mis gastos</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/gastosTotales")}
          >
            <Text style={styles.buttonText}>Gastos Totales</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => router.push("/detalleGastos")}
          >
            <Text style={styles.buttonText}>Detalle de mis Gastos</Text>
          </TouchableOpacity>

        </View>

        <Text style={styles.footer}>¡Ahorrar es progreso!</Text>

      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6B400",
    paddingHorizontal: 25,
    paddingTop: 70,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },

  welcome: {
    fontSize: 26,
    fontWeight: "bold",
  },

  question: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 40,
    marginBottom: 50,
  },

  buttonsWrapper: {
    gap: 20,
    width: "100%",
    alignItems: "center",
  },

  button: {
    backgroundColor: "black",
    width: "80%",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    elevation: 3,
  },

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 18,
  },

  footer: {
    position: "absolute",
    bottom: 50,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
