import * as Location from "expo-location";
import { useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Linking,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import api from "./api";

export default function WorkerHome() {
  const { user, skill } = useLocalSearchParams();
  const parsedUser = JSON.parse(user as string);
  const selectedSkill = (skill as string)?.toUpperCase() || "";

  const [engineers, setEngineers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchNearbyEngineers();
  }, []);

  const fetchNearbyEngineers = async (isRefresh = false) => {
    try {
      isRefresh ? setRefreshing(true) : setLoading(true);
  let loc = await Location.getLastKnownPositionAsync();

if (!loc) {
  loc = await Location.getCurrentPositionAsync({
    accuracy: Location.Accuracy.Balanced,
  });
}
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };
     console.log("Current Location:", coords);
      const { latitude, longitude } = coords;
      const response = await api.get(`/engineer/nearby?lat=${latitude}&lon=${longitude}&skill=${selectedSkill}`);
      setEngineers(response.data);
    } catch (err) {
      Alert.alert("Failed to fetch contacts");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const refreshEngineers = () => fetchNearbyEngineers(true);

  // Filter engineers by selected skill
  const filteredEngineers = engineers.filter(
    (eng) => eng.skill?.toUpperCase() === selectedSkill
  );

  const renderEngineer = ({ item }: any) => (
    <View style={styles.card}>
      <Text style={styles.name}>{item.name}</Text>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Skill:</Text>
        <Text style={styles.value}>{item.skill}</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Experience:</Text>
        <Text style={styles.value}>{item.experienceYears} yrs</Text>
      </View>

      <View style={styles.infoRow}>
        <Text style={styles.label}>Distance:</Text>
        <Text style={styles.value}>{item.distanceKm.toFixed(2)} km</Text>
      </View>

      <TouchableOpacity
        style={styles.callButton}
        onPress={() => {
          if (item.phone) Linking.openURL(`tel:${item.phone}`);
          else Alert.alert("Phone number not available");
        }}
      >
        <Text style={styles.callText}>Contact: {item.phone}</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.headerContainer}>
        <Text style={styles.header}>Nearby {selectedSkill} Contacts</Text>
        <Text style={styles.subtitle}>Available professionals around you</Text>

        <TouchableOpacity style={styles.refreshButton} onPress={refreshEngineers}>
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>

      {loading && engineers.length === 0 ? (
        <ActivityIndicator size="large" style={{ marginTop: 30 }} />
      ) : (
        <FlatList
          data={filteredEngineers}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderEngineer}
          showsVerticalScrollIndicator={false}
          refreshing={refreshing}
          onRefresh={refreshEngineers}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyTitle}>No {selectedSkill} nearby</Text>
              <Text style={styles.emptySubtitle}>Try again in a few minutes</Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8fafc", paddingHorizontal: 20, paddingTop: 60 },
  headerContainer: { marginBottom: 20 },
  header: { fontSize: 28, fontWeight: "bold", color: "#111" },
  subtitle: { fontSize: 15, color: "#6b7280", marginTop: 4 },
  refreshButton: { marginTop: 10, alignSelf: "flex-start", backgroundColor: "#3b82f6", paddingVertical: 6, paddingHorizontal: 14, borderRadius: 8 },
  refreshText: { color: "white", fontWeight: "600" },
  card: { backgroundColor: "white", padding: 18, borderRadius: 14, marginBottom: 18, elevation: 3 },
  name: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#111" },
  infoRow: { flexDirection: "row", marginBottom: 4 },
  label: { fontWeight: "600", color: "#555", marginRight: 5 },
  value: { color: "#444" },
  callButton: { backgroundColor: "#16a34a", padding: 12, borderRadius: 10, marginTop: 12, alignItems: "center" },
  callText: { color: "white", fontWeight: "600" },
  emptyContainer: { alignItems: "center", marginTop: 60 },
  emptyTitle: { fontSize: 18, fontWeight: "600", color: "#333" },
  emptySubtitle: { fontSize: 14, color: "#888", marginTop: 5 },
});