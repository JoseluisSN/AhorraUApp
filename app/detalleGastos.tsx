import { Stack } from "expo-router";
import { useState } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from "react-native";

// Tipos de gastos
type GastosType = {
  [key: string]: number;
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
      setGastos({ ...gastos, [key]: 0 });
      setEditValues({ ...editValues, [key]: 0 });
    }

    setShowCategories(false);
  };

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
        <View style={styles.piePlaceholder} />
      </View>

      {/* Botón Editar */}
      <TouchableOpacity
        onPress={() => setEditing(!editing)}
        style={styles.borderWhiteButton}
      >
        <Text style={styles.whiteText}>
          {editing ? "Cancelar" : "Editar montos"}
        </Text>
      </TouchableOpacity>

      {/* Sección Editar */}
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
                  setEditValues({ ...editValues, [key]: Number(t) })
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

      {/* Botón Añadir categoría */}
      <TouchableOpacity
        style={styles.addCategoryButton}
        onPress={() => setShowCategories(!showCategories)}
      >
        <Text style={styles.addCategoryText}>Añadir categoría</Text>
      </TouchableOpacity>

      {/* Lista categorías */}
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

// Row TIPADO
function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text>{label}</Text>
      <Text style={styles.rowValue}>{value}</Text>
    </View>
  );
}

// función capitalizar TIPADA
function capitalizar(texto: string): string {
  return texto.charAt(0).toUpperCase() + texto.slice(1);
}

// ------------------------------
// ESTILOS 100% CORRECTOS
// ------------------------------

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
