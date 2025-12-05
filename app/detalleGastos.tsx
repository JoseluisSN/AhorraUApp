import AsyncStorage from "@react-native-async-storage/async-storage";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { PieChart } from "react-native-chart-kit";

const screenWidth = Dimensions.get("window").width;

// BACKEND 
const BACKEND_URL = "https://skinlike-clutchingly-hyun.ngrok-free.dev";

const API_GET_GASTOS = `${BACKEND_URL}/gastos/usuario`;
const API_UPDATE_GASTOS = `${BACKEND_URL}/gastos/actualizar`;
const API_ADD_CATEGORY = `${BACKEND_URL}/categorias/nueva`;

type GastosType = { [key: string]: number };

// Obtener gastos desde backend
async function obtenerGastos(usuarioId: string) {
  const res = await fetch(`${API_GET_GASTOS}/${usuarioId}`);

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Error obteniendo gastos");

  return data.gastos; 
}

// 🔥 Guardar gastos en backend
async function guardarGastosEnBackend(usuarioId: string, gastos: GastosType) {
  const res = await fetch(API_UPDATE_GASTOS, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ usuario_id: usuarioId, gastos }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Error guardando gastos");

  return data;
}

export default function DetalleGastos() {
  const { reducciones } = useLocalSearchParams<{ reducciones?: string }>();

  const [usuarioId, setUsuarioId] = useState<string>("");
  const [gastos, setGastos] = useState<GastosType>({});
  const [editValues, setEditValues] = useState<GastosType>({});
  const [editing, setEditing] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [reduccionesAplicadas, setReduccionesAplicadas] = useState(false); 

  // CARGAR USUARIO + GASTOS

  useEffect(() => {
    (async () => {
      const id = await AsyncStorage.getItem("usuario_id");
      if (!id) {
        Alert.alert("Error", "No se encontró la ID de usuario.");
        return;
      }

      setUsuarioId(id);
      // console.log("ID crudo en Async:", JSON.stringify(id));

      try {
        const base = await obtenerGastos(id);
        const gastosIniciales = base || {}; // Asegurar que sea un objeto
        setGastos(gastosIniciales);
        setEditValues(gastosIniciales);
      } catch (err) {
        console.log("Error cargando gastos:", err);
        setGastos({});
        setEditValues({});
      }
    })();
  }, []);

  // APLICAR REDUCCIONES

  useEffect(() => {
    // 🛑 Rompemos el bucle si ya se aplicó la reducción
    if (!reducciones || reduccionesAplicadas) return; 
    if (Object.keys(gastos).length === 0) return;

    let reduc;
    try {
      reduc = JSON.parse(reducciones); // 🛡️ JSON.parse protegido
    } catch (e) {
      console.error("Error parseando reducciones:", e);
      return;
    }

    const nuevos = { ...gastos };
    
    Object.keys(reduc).forEach((cat) => {
      const valorReduccion = Number(reduc[cat]) || 0;
      if (nuevos[cat] != null) {
        nuevos[cat] = Math.max(0, nuevos[cat] - valorReduccion);
      }
    });

    actualizarTotales(nuevos);
    setReduccionesAplicadas(true); // 🚩 Marcamos como aplicado
  }, [reducciones, gastos]);

  // Recalcular TOTAL

  function actualizarTotales(obj: GastosType) {
    const total = Object.entries(obj)
      .filter(([k]) => k !== "total")
      .reduce((acc, [, v]) => acc + Number(v), 0);

    const nuevos = { ...obj, total };

    setGastos(nuevos);
    setEditValues(nuevos);

    return nuevos;
  }

  // Confirmar edición local

  const handleConfirm = () => {
    const actualizados = actualizarTotales(editValues);
    setGastos(actualizados);
    setEditing(false);
  };

  // Crear categoría

  const categories = ["Salud", "Educación", "Mascotas", "Imprevistos"];

  async function addCategory(cat: string) {
    const key = cat.toLowerCase();

    if (!gastos[key]) {
      const nuevos = { ...gastos, [key]: 1 };
      actualizarTotales(nuevos);

      try {
        await fetch(API_ADD_CATEGORY, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ usuario_id: usuarioId, categoria: key }),
        });
      } catch (err) {
        console.log("Error backend categoría:", err);
      }
    }

    setShowCategories(false);
  }

  // Gráfico (CORREGIDO para evitar datos no numéricos)

  const pieData = Object.keys(gastos)
    .filter((k) => k !== "total")
    .map((k, i) => {
      // ✅ SANITIZACIÓN: Asegura que el valor es un número válido.
      const numericValue = Number(gastos[k]) || 0; 
      return {
        name: capitalizar(k),
        population: numericValue, // Usar el valor sanitizado
        color: colores[i % colores.length],
        legendFontColor: "#000",
        legendFontSize: 12,
      };
    })
    .filter((x) => x.population > 0);

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen
        options={{
          title: "Regresar",
          headerTintColor: "#000",
          headerStyle: { backgroundColor: "#F6B400" },
        }}
      />

      <Text style={styles.title}>Detalle de Gastos</Text>

      {/* RESUMEN */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen Semanal</Text>

        {Object.keys(gastos).map((key) => (
          <Row key={key} label={capitalizar(key)} value={`S/. ${gastos[key]}`} />
        ))}

        <Text style={styles.subtitle}>Distribución</Text>

        {pieData.length > 0 ? (
          <PieChart
            data={pieData}
            width={screenWidth - 40}
            height={200}
            accessor="population"
            absolute
            backgroundColor="transparent"
            paddingLeft="0"
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => "#000",
            }}
          />
        ) : (
          <View style={styles.piePlaceholder}>
            <Text>No hay datos suficientes</Text>
          </View>
        )}
      </View>

      {/* EDITAR */}
      <TouchableOpacity
        style={styles.borderWhiteButton}
        onPress={() => setEditing(!editing)}
      >
        <Text style={styles.whiteText}>{editing ? "Cancelar" : "Editar"}</Text>
      </TouchableOpacity>

      {editing && (
        <View style={styles.editContainer}>
          {Object.keys(editValues).map((key) => (
            <View key={key} style={{ marginBottom: 10 }}>
              <Text style={styles.fieldLabel}>{capitalizar(key)}</Text>
              <TextInput
                value={String(editValues[key])}
                onChangeText={(t) =>
                  setEditValues((prev) => ({
                    ...prev,
                    [key]: Number(t || 0),
                  }))
                }
                keyboardType="numeric"
                style={styles.editInput}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.blackButton} onPress={handleConfirm}>
            <Text style={styles.blackButtonText}>Confirmar cambios</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* GUARDAR EN BACKEND */}
      <TouchableOpacity
        style={styles.saveButton}
        onPress={async () => {
          try {
            await guardarGastosEnBackend(usuarioId, gastos);
            Alert.alert("Éxito", "Guardado correctamente ✔");
          } catch {
            Alert.alert("Error", "Error guardando en backend");
          }
        }}
      >
        <Text style={styles.saveButtonText}>Guardar cambios</Text>
      </TouchableOpacity>

      {/* CATEGORÍAS */}
      <TouchableOpacity
        style={styles.addCategoryButton}
        onPress={() => setShowCategories(!showCategories)}
      >
        <Text style={styles.addCategoryText}>Añadir categoría</Text>
      </TouchableOpacity>

      {showCategories && (
        <View style={styles.categoryList}>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat}
              style={styles.categoryItem}
              onPress={() => addCategory(cat)}
            >
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

function Row({ label, value }: any) {
  return (
    <View style={styles.row}>
      <Text>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function capitalizar(t: string) {
  return t.charAt(0).toUpperCase() + t.slice(1);
}

const colores = ["#FF5733", "#FFC300", "#36A2EB", "#4CAF50"];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6B400", padding: 20 },

  title: { fontSize: 24, fontWeight: "bold", marginBottom: 15 },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },
  cardTitle: { fontWeight: "bold", marginBottom: 10 },
  subtitle: { marginTop: 15, fontWeight: "bold" },

  piePlaceholder: {
    height: 160,
    backgroundColor: "#e0e0e0",
    borderRadius: 100,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  row: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  rowValue: { fontWeight: "bold" },

  borderWhiteButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 15,
  },
  whiteText: { textAlign: "center", fontWeight: "bold", fontSize: 16 },

  editContainer: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },
  fieldLabel: { fontWeight: "600", marginBottom: 5 },
  editInput: {
    backgroundColor: "#f1f1f1",
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ccc",
  },

  blackButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 10,
  },
  blackButtonText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
    color: "white",
  },

  saveButton: {
    backgroundColor: "#0066CC",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  saveButtonText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  addCategoryButton: {
    backgroundColor: "black",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 12,
  },
  addCategoryText: {
    color: "white",
    textAlign: "center",
    fontWeight: "700",
    fontSize: 16,
  },

  categoryList: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginTop: 10,
  },
  categoryItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#ddd",
  },
  categoryText: { fontWeight: "600", fontSize: 16 },
});