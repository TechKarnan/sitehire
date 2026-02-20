import { Linking, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function WorkerCard({ worker }: any) {

  const callWorker = () => {
    Linking.openURL(`tel:${worker.phone}`);
  };

  return (
    <View style={styles.card}>
      <Text style={styles.name}>{worker.name}</Text>
      <Text>Skill: {worker.skill}</Text>
      <Text>Experience: {worker.experienceYears} years</Text>
      <Text>Distance: {worker.distanceKm?.toFixed(2)} km</Text>

      <TouchableOpacity style={styles.button} onPress={callWorker}>
        <Text style={{ color: "white" }}>Call</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    elevation: 4,
  },
  name: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: "#2563eb",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});