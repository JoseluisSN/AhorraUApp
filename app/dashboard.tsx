import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, Stack } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// Lógica de Backend para Gastos
const BACKEND_URL = "https://skinlike-clutchingly-hyun.ngrok-free.dev";
const API_GET_GASTOS = `${BACKEND_URL}/gastos/usuario`;
type GastosType = { [key: string]: number };

async function obtenerGastos(usuarioId: string): Promise<GastosType> {
  const res = await fetch(`${API_GET_GASTOS}/${usuarioId}`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Error obteniendo gastos");
  return data.gastos as GastosType;
}

//Lógica para la Recomendación (sin saltos de línea)

function generarRecomendacion(gastos: GastosType): string {
  const total =
    gastos.total ||
    Object.entries(gastos).reduce(
      (acc, [k, v]) => (k !== "total" ? acc + Number(v) : acc),
      0
    ) ||
    0;

  if (total === 0) {
    return "🚀 ¡Empieza a registrar tus gastos para recibir un análisis personalizado!";
  }

  const costoCafe = 8;
  const cafeEquivalencia = Math.floor(total / costoCafe);

  const ahorroIdeal = total * 0.1;
  const ahorroPorcentaje = 10;

  const totalFormateado = total.toFixed(2);
  const ahorroFormateado = ahorroIdeal.toFixed(2);

  if (total > 300) {
    return `💸 ¡Cuidado! Tu gasto semanal es de S/. ${totalFormateado}. Esto equivale a ${cafeEquivalencia} cafés. Si reduces solo el ${ahorroPorcentaje}%, ahorrarías S/. ${ahorroFormateado}.`;
  }

  if (total > 100) {
    return `📈 Tu gasto semanal es S/. ${totalFormateado}. Para ahorrar S/. ${ahorroFormateado}, solo necesitas reducir ${ahorroPorcentaje}% de tus gastos. ¡El equivalente a no comprar ${Math.floor(
      ahorroIdeal / costoCafe
    )} cafés!`;
  }

  return `💰 ¡Felicidades! Gasto de S/. ${totalFormateado} es excelente. Mantente así. Si necesitas un extra, un ${ahorroPorcentaje}% de ahorro son S/. ${ahorroFormateado}.`;
}

//Lógica para el Consejo Financiero

function getFinancialTip(): string {
  const tips = [
    "Establece una meta de ahorro mensual. ¡El 10% de tus ingresos es un excelente inicio!",
    "La regla 50/30/20 es tu amiga: 50% para necesidades, 30% para deseos y 20% para ahorro/deudas.",
    "Analiza tus gastos fijos y busca alternativas más económicas cada 6 meses.",
    "Crea un fondo de emergencia que cubra 3 meses de tus gastos.",
    "Evita compras impulsivas. Esperar 24 horas te ayuda a decidir si realmente lo necesitas.",
  ];
  const randomIndex = Math.floor(Math.random() * tips.length);
  return tips[randomIndex];
}

export default function Home() {
  const [nombre, setNombre] = useState("Usuario");
  const [universidad, setUniversidad] = useState("---");
  const [usuarioId, setUsuarioId] = useState("---");
  const [recomendacion, setRecomendacion] = useState("");
  const [consejoFinanciero, setConsejoFinanciero] = useState("");

  useEffect(() => {
    const cargarDatos = async () => {
      const n = await AsyncStorage.getItem("nombre");
      const u = await AsyncStorage.getItem("universidad");
      const id = await AsyncStorage.getItem("usuario_id");

      if (n) setNombre(n);
      if (u) setUniversidad(u);
      if (id) setUsuarioId(id);

      setConsejoFinanciero(getFinancialTip());

      if (id) {
        try {
          const gastos = await obtenerGastos(id);
          const recomendacionText = generarRecomendacion(gastos);
          setRecomendacion(recomendacionText);
        } catch (error) {
          console.log("Error al cargar gastos:", error);
          setRecomendacion("No se pudo cargar la recomendación.");
        }
      }
    };

    cargarDatos();
  }, []);

  const cerrarSesion = async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que deseas cerrar sesión?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.clear();
            router.replace("/");
          },
        },
      ]
    );
  };

  return (
    <>
      <Stack.Screen options={{ headerShown: false, gestureEnabled: false }} />

      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.welcome}>Hola {nombre}!</Text>
            <Text style={styles.subInfo}>ID usuario: {usuarioId}</Text>
          </View>

          <TouchableOpacity style={styles.logoutBtn} onPress={cerrarSesion}>
            <Text style={styles.logoutText}>Salir</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.question}>¿Qué deseas hacer?</Text>

        {/*  BOTONES */}
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

        {/*  RECOMENDACIÓN */}
        {recomendacion !== "" && (
          <View style={styles.recommendationTag}>
            <Text style={styles.recommendationLabel}>Análisis Rápido:</Text>
            <Text style={styles.recommendationText}>{recomendacion}</Text>
          </View>
        )}

        {/*  CONSEJO */}
        {consejoFinanciero !== "" && (
          <View style={styles.tipTag}>
            <Text style={styles.tipLabel}>Consejo Financiero 💡:</Text>
            <Text style={styles.tipText}>{consejoFinanciero}</Text>
          </View>
        )}

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
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  welcome: {
    fontSize: 26,
    fontWeight: "bold",
  },
  subInfo: {
    fontSize: 14,
    marginTop: 2,
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  logoutText: {
    color: "white",
    fontWeight: "bold",
  },
  question: {
    fontSize: 23,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 40,
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
  recommendationTag: {
    backgroundColor: "#000",
    padding: 18,
    borderRadius: 12,
    marginTop: 25,
    width: "95%",
    alignSelf: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  recommendationLabel: {
    color: "#F6B400",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  recommendationText: {
    color: "white",
    fontWeight: "500",
    fontSize: 15,
  },
  tipTag: {
    backgroundColor: "#ffffff",
    padding: 18,
    borderRadius: 12,
    marginTop: 15,
    width: "95%",
    alignSelf: "center",
    borderWidth: 2,
    borderColor: "#0066cc",
  },
  tipLabel: {
    color: "#0066cc",
    fontWeight: "bold",
    fontSize: 14,
    marginBottom: 5,
  },
  tipText: {
    color: "black",
    fontWeight: "500",
    fontSize: 15,
  },
  footer: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
});
