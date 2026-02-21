import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from "expo-router";
import { JSX, useEffect, useState } from "react";
import { Dimensions, FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import api from "./api";

const { width } = Dimensions.get("window");
const TILE_SIZE = width / 2 - 25;

const skillIcons: Record<string, JSX.Element> = {
  MASON: <FontAwesome5 name="tools" size={40} color="#fff" />,
  ELECTRICIAN: <MaterialCommunityIcons name="flash" size={40} color="#fff" />,
  PLUMBER: <MaterialCommunityIcons name="pipe-wrench" size={40} color="#fff" />,
  CARPENTER: <MaterialCommunityIcons name="hammer" size={40} color="#fff" />,
  PAINTER: <MaterialCommunityIcons name="format-paint" size={40} color="#fff" />,
  HELPER: <MaterialCommunityIcons name="account-group" size={40} color="#fff" />,
  BUILDER: <MaterialCommunityIcons name="home-city" size={40} color="#fff" />,
};

export default function SkillsScreen() {
  const router = useRouter();
  const { user, role } = useLocalSearchParams();
  const userObj = JSON.parse(user as string);

  const [skills, setSkills] = useState<string[]>([]);

  useEffect(() => {
    fetchSkills();
    updateLocationInBackground();
  }, []);

  // Fetch skills without waiting for location
  const fetchSkills = async () => {
    try {
      const endpoint = `/skills?role=${role}`;
      const res = await api.get(endpoint);
      setSkills(res.data);
    } catch (err) {
      console.log("Error fetching skills:", err);
    }
  };

  // Fire-and-forget location update
  const updateLocationInBackground = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") return;

      const loc = await Location.getCurrentPositionAsync({});
      const coords = { latitude: loc.coords.latitude, longitude: loc.coords.longitude };

      // Update backend, no UI blocking
      api.put(`/worker/location`, {
        userId: userObj.id,
        latitude: coords.latitude,
        longitude: coords.longitude,
      }).catch(() => console.log("Location update failed"));
    } catch (err) {
      console.log("Background location error:", err);
    }
  };

  const goToHome = (skill: string) => {
    const params = { user: JSON.stringify(userObj), skill };
    if (role === "WORKER") router.push({ pathname: "/worker-home", params });
    else router.push({ pathname: "/engineer-home", params });
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity style={styles.tile} onPress={() => goToHome(item)}>
      {skillIcons[item.toUpperCase()] || <MaterialCommunityIcons name="tools" size={40} color="#fff" />}
      <Text style={styles.tileText}>{formatSkill(item)}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Select Skill</Text>

      <FlatList
        data={skills}
        renderItem={renderItem}
        keyExtractor={(item) => item}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 20, marginTop: 10 }}
      />
    </View>
  );
}

function formatSkill(skill: string) {
  return skill.charAt(0) + skill.slice(1).toLowerCase();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    padding: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  tile: {
    width: TILE_SIZE,
    height: TILE_SIZE,
    backgroundColor: "#2563eb",
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    elevation: 6,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  tileText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
});