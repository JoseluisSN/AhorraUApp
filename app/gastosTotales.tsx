import { router, Stack, useLocalSearchParams } from "expo-router";
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { BarChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

export default function GastosTotales() {
  const { resultado } = useLocalSearchParams<{ resultado: string }>();

  const data = resultado ? JSON.parse(resultado) : null;

  console.log("📌 DATA RECIBIDA EN GASTOS TOTALES:", data);

  const ahorro = data?.ahorro_total ?? 0;
  const estrategia = data?.estrategia ?? [];

  const labels = estrategia.map((item: any) => item.categoria);
  const values = estrategia.map((item: any) => Number(item.nuevo_monto));

  return (
    <View style={styles.container}>

      <Stack.Screen
  options={{
    title: "Regresar",
    headerStyle: { backgroundColor: "#F6B400" },
    headerTintColor: "#000",
    headerShadowVisible: false,
    gestureEnabled: false,
    headerLeft: () => (
      <TouchableOpacity onPress={() => router.replace("/dashboard")}>
        <Image
          source={require("../assets/images/leftarrow.png")}
          style={{ width: 28, height: 28, marginLeft: 10 }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    ),
  }}
/>


      <Text style={styles.title}>Resultado del análisis</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Ahorro máximo posible</Text>
        <Text style={{ fontSize: 26, fontWeight: "bold" }}>S/. {ahorro}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reducciones sugeridas</Text>

        {estrategia.map((item: any, idx: number) => (
          <Text key={idx} style={{ fontSize: 16 }}>
            {item.categoria}:  
            <Text style={{ fontWeight: "bold" }}> S/. {item.nuevo_monto}</Text>  
            {"  "}({item.accion})
          </Text>
        ))}
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Reducciones por categoría</Text>

        <BarChart
          data={{
            labels,
            datasets: [{ data: values }],
          }}
          width={screenWidth - 60}
          height={180}
          fromZero
          yAxisLabel="S/ "
          yAxisSuffix=""
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            decimalPlaces: 0,
            color: () => "#000",
            labelColor: () => "#000",
          }}
          style={{ borderRadius: 12 }}
        />
      </View>

      <TouchableOpacity
        style={styles.detailButton}
        onPress={() =>
          router.push({
            pathname: "/detalleGastos",
            params: { reducciones: JSON.stringify(estrategia) },
          })
        }
      >
        <Text style={styles.detailText}>Ver Detalles</Text>
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
