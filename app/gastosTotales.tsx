import { Stack, router } from "expo-router";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart, LineChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function GastosTotales() {
  // Datos de ejemplo (luego puedes reemplazarlos por datos reales)
  const mensualData = {
    labels: ["Ene", "Feb", "Mar", "Abr"],
    datasets: [
      {
        data: [250, 320, 280, 480], // Gastos mensuales
      },
    ],
  };

  const semanalData = {
    labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
    datasets: [
      {
        data: [20, 35, 10, 50, 15, 40, 25], // Gastos por día
      },
    ],
  };

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

      {/* GASTOS MENSUAL */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gastos Totales - Mensual</Text>

        <LineChart
          data={mensualData}
          width={screenWidth - 60}
          height={180}
          yAxisSuffix=" s/."
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            decimalPlaces: 0,
            color: () => "#000",
            labelColor: () => "#000",
          }}
          style={{ borderRadius: 12 }}
        />
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Gastos Totales - Semanal</Text>

      <BarChart
        data={semanalData}
        width={screenWidth - 60}
        height={180}
        yAxisSuffix=" s/."
        yAxisLabel=""
        fromZero={true}
        withInnerLines={true}
        chartConfig={{
        backgroundColor: "#fff",
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        decimalPlaces: 0,
        color: () => "#000",
        labelColor: () => "#000",

      propsForBackgroundLines: {
        stroke: "#ccc",
        strokeWidth: 1,
        strokeDasharray: "0",
        x1: 60,
        x2: screenWidth - 20,
      },
    }}
    style={{ borderRadius: 12 }}
  />


      </View>

      {/* RESUMEN */}
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
