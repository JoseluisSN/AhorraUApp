import { Stack, router } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function GastosTotales() {
  return (
    <View style={styles.container}>

      <Stack.Screen
        options={{
          title: "Regresar",
          headerStyle: { backgroundColor: "#F6B400" },
          headerTintColor: "#000",
          headerShadowVisible: false,
        }}
      />

      <Text style={styles.title}>Mis gastos Totales</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gastos Totales - Mensual</Text>
        <View style={styles.graphPlaceholder} />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gastos Totales - Semanal</Text>
        <View style={styles.graphPlaceholder} />
      </View>

      <View style={styles.summary}>
        <Text style={styles.summaryTitle}>Resumen de Gastos</Text>

        <Text>Total Gastos: S/. 480</Text>
        <Text>Gasto Promedio Diario: S/. 24</Text>
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={() => router.push("/detalleGastos")}
      >
        <Text style={styles.detailText}>Ver Detalle</Text>
      </TouchableOpacity>

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6B400",
    paddingHorizontal: 20,
    paddingTop: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 10,
  },

  graphPlaceholder: {
    height: 120,
    backgroundColor: "#e0e0e0",
    borderRadius: 12,
  },

  summary: {
    marginTop: 10,
  },

  summaryTitle: {
    fontWeight: "bold",
    marginBottom: 6,
  },

  detailButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 30,
  },

  detailText: {
    textAlign: "center",
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
