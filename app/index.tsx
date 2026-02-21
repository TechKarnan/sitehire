import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import api from "./api";

export default function Login() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [mpin, setMpin] = useState("");

  const login = async () => {
    try {
      const res = await api.post("/auth/login", { phone, mpin });
      const user = res.data;

      // ✅ Navigate to Skills screen and pass user + role
      router.replace({
        pathname: "/skills",
        params: {
          user: JSON.stringify(user),
          role: user.role=="WORKER"?"ENGINEER":"WORKER", // "WORKER" or "ENGINEER"
        },
      });
    } catch (e) {
      Alert.alert("Login failed", "Invalid phone or MPIN");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SiteHire</Text>

      <TextInput
        placeholder="Phone"
        style={styles.input}
        onChangeText={setPhone}
      />
      <TextInput
        placeholder="MPIN"
        secureTextEntry
        style={styles.input}
        onChangeText={setMpin}
      />

      <TouchableOpacity style={styles.button} onPress={login}>
        <Text style={{ color: "white" }}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push("/register")}>
        <Text style={{ marginTop: 20 }}>New User? Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 40, textAlign: "center" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#2563eb",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
});