import { Picker } from "@react-native-picker/picker";
import * as Location from "expo-location";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import api from "./api";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [mpin, setMpin] = useState<string>("");
  const [role, setRole] = useState<string>("WORKER");

  const [skill, setSkill] = useState<string>("PLUMBER");
  const [experienceYears, setExperienceYears] = useState<string>("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  // 📍 Get Location Automatically
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        Alert.alert("Location permission denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    })();
  }, []);

  const register = async () => {
    try {
      if (!latitude || !longitude) {
        Alert.alert("Location not ready");
        return;
      }

      let payload: any = {
        name,
        phone,
        mpin,
        role,
        latitude,
        longitude,
      };

      if (role === "WORKER") {
        payload.skill = skill;
        payload.experienceYears = parseInt(experienceYears);
      }

      await api.post("/auth/register", payload);

      Alert.alert("Registered Successfully");
      router.back();
    } catch (error) {
      console.log(error);
      Alert.alert("Registration failed");
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        placeholder="Name"
        style={styles.input}
        value={name}
        onChangeText={setName}
      />

      <TextInput
        placeholder="Phone"
        style={styles.input}
        keyboardType="numeric"
        value={phone}
        onChangeText={setPhone}
      />

      <TextInput
        placeholder="MPIN"
        style={styles.input}
        secureTextEntry
        keyboardType="numeric"
        value={mpin}
        onChangeText={setMpin}
      />

      {/* Role Dropdown */}
      <Text style={styles.label}>Select Role</Text>
      <View style={styles.dropdown}>
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRole(itemValue)}
        >
          <Picker.Item label="Worker" value="WORKER" />
          <Picker.Item label="Engineer" value="ENGINEER" />
        </Picker>
      </View>

      {/* Show Only For Worker */}
      {role === "WORKER" && (
        <>
          <Text style={styles.label}>Select Skill</Text>
          <View style={styles.dropdown}>
            <Picker
              selectedValue={skill}
              onValueChange={(itemValue) => setSkill(itemValue)}
            >
              <Picker.Item label="Plumber" value="PLUMBER" />
              <Picker.Item label="Electrician" value="ELECTRICIAN" />
              <Picker.Item label="Carpenter" value="CARPENTER" />
              <Picker.Item label="Painter" value="PAINTER" />
            </Picker>
          </View>

          <TextInput
            placeholder="Experience (Years)"
            style={styles.input}
            keyboardType="numeric"
            value={experienceYears}
            onChangeText={setExperienceYears}
          />
        </>
      )}

      {/* Location Status */}
      {latitude && longitude ? (
        <Text style={styles.locationText}>📍 Location captured</Text>
      ) : (
        <Text style={styles.locationText}>Getting location...</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={register}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f9fafb",
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },

  label: {
    fontSize: 14,
    marginBottom: 5,
    color: "#555",
  },

  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  dropdown: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
    marginBottom: 20,
    backgroundColor: "#fff",
  },

  locationText: {
    marginBottom: 20,
    textAlign: "center",
    color: "gray",
  },

  button: {
    backgroundColor: "#16a34a",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});