import { Stack } from "expo-router";
import { useState } from "react";
import {
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

type GastosType = {
  [key: string]: string | number;
};

export default function DetalleGastos() {
  const [gastos, setGastos] = useState<GastosType>({
    total: 180,
    servicios: 0,
    ocio: 30,
    alimentos: 55,
    transporte: 60,
    otros: 35,
  });

  const [editValues, setEditValues] = useState<GastosType>({ ...gastos });
  const [editing, setEditing] = useState<boolean>(false);
  const [showCategories, setShowCategories] = useState<boolean>(false);

  const handleConfirm = () => {
    setGastos(editValues);
    setEditing(false);
  };

  const categories = [
    "Salud",
    "Educación",
    "Mascotas",
    "Ropa",
    "Entretenimiento",
    "Imprevistos",
  ];

  const addCategory = (cat: string) => {
    const key = cat.toLowerCase();

    if (!gastos[key]) {
      setGastos({ ...gastos, [key]: 1 });
      setEditValues({ ...editValues, [key]: 1 });
    }

    setShowCategories(false);
  };

  const colores = [
    "#FF5733",
    "#FFC300",
    "#36A2EB",
    "#4CAF50",
    "#9C27B0",
    "#FF9800",
    "#009688",
    "#E91E63",
  ];

  const clavesUnicas = Array.from(
    new Map(
      Object.keys(gastos)
        .filter((k) => k !== "total")
        .map((k) => [capitalizar(k), k])
    ).values()
  );


  const pieData = Object.keys(gastos)
    .filter((k) => k !== "total" && typeof gastos[k] === "number")
    .map((k, i) => ({
      name: capitalizar(k),
      value: gastos[k] ?? 0,
      color: colores[i % colores.length] || "#000",
      legendFontColor: "#000",
      legendFontSize: 12,
    }))
    .filter((item) => Number(item.value) > 0);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      showsVerticalScrollIndicator={false}
    >
      <Stack.Screen
        options={{
          title: "Regresar",
          headerStyle: { backgroundColor: "#F6B400" },
          headerTintColor: "#000",
          headerShadowVisible: false,
        }}
      />

      <Text style={styles.title}>Detalle de gastos</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Resumen de Gasto Semanal</Text>

        {Object.keys(gastos).map((key) => (
          <Row key={key} label={capitalizar(key)} value={`S/. ${gastos[key]}`} />
        ))}

        <Text style={styles.subtitle}>Distribución de Gastos</Text>

        {pieData.length > 0 ? (
          <PieChart
            data={pieData.map((p) => ({
              name: p.name,
              population: p.value,
              color: p.color,
              legendFontColor: "#000",
              legendFontSize: 12,
            }))}
            width={screenWidth - 40}
            height={200}
            chartConfig={{
              backgroundColor: "#fff",
              backgroundGradientFrom: "#fff",
              backgroundGradientTo: "#fff",
              color: () => "#000",
              decimalPlaces: 0,
            }}
            accessor="population"
            backgroundColor="transparent"
            paddingLeft="0"
            absolute
          />
        ) : (
          <View style={styles.piePlaceholder}>
            <Text style={{ textAlign: "center" }}>
              No hay suficientes datos para mostrar el gráfico
            </Text>
          </View>
        )}
      </View>

      <TouchableOpacity
        onPress={() => setEditing(!editing)}
        style={styles.borderWhiteButton}
      >
        <Text style={styles.whiteText}>
          {editing ? "Cancelar" : "Editar montos"}
        </Text>
      </TouchableOpacity>

      {editing && (
        <View style={styles.editContainer}>
          <Text style={styles.editTitle}>Editar montos</Text>

          {Object.keys(editValues).map((key) => (
            <View key={key} style={{ marginBottom: 12 }}>
              <Text style={styles.fieldLabel}>{capitalizar(key)}</Text>

              <TextInput
                keyboardType="numeric"
                value={String(editValues[key])}
                onChangeText={(t) =>
                  setEditValues({ ...editValues, [key]: t === "" ? 0 : Number(t) })
                }

                style={styles.editInput}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.blackButton} onPress={handleConfirm}>
            <Text style={styles.blackButtonText}>Confirmar cambios</Text>
          </TouchableOpacity>
        </View>
      )}

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

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6B400",
    padding: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },

  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 14,
    marginBottom: 20,
  },

  cardTitle: {
    fontWeight: "bold",
    marginBottom: 12,
    fontSize: 16,
  },

  subtitle: {
    marginTop: 15,
    fontWeight: "bold",
  },

  piePlaceholder: {
    height: 160,
    backgroundColor: "#e0e0e0",
    borderRadius: 100,
    marginTop: 15,
    justifyContent: "center",
    alignItems: "center",
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  rowValue: {
    fontWeight: "bold",
  },

  borderWhiteButton: {
    backgroundColor: "white",
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#000",
    marginBottom: 15,
  },

  whiteText: {
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },

  editContainer: {
    backgroundColor: "white",
    padding: 18,
    borderRadius: 14,
    marginBottom: 20,
  },

  editTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 12,
  },

  fieldLabel: {
    fontWeight: "600",
    marginBottom: 5,
  },

  editInput: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 10,
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

  categoryText: {
    fontWeight: "600",
    fontSize: 16,
  },
});
