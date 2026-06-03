import { useRouter } from "expo-router";
import { useState } from "react";
import { Pressable, TextInput } from "react-native";

import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { useAuth } from "../context/AuthContext";


export default function LoginScreen() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  const handleLogin = async () => {
  try {
    setLoading(true);
    setError("");

    await login(email, password);
  } catch {
    setError("Correo o contraseña incorrectos");
  } finally {
    setLoading(false);
  }
};
  return (
    <Box className="flex-1 bg-white justify-center px-8">

      <Text className="text-5xl text-center mb-2">
        🐱
      </Text>

      <Text className="text-center text-gray-400 mb-10">
        Organize your tasks with calm vibes
      </Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        className="
          border 
          border-pink-100
          rounded-2xl
          p-4
          mb-4
          bg-pink-50
        "
      />

      <TextInput
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="
          border
          border-purple-100
          rounded-2xl
          p-4
          mb-4
          bg-purple-50
        "
      />

      {error ? (
        <Text className="text-rose-400 mb-4">
          {error}
        </Text>
      ) : null}

      <Pressable
        onPress={handleLogin}
        disabled={loading}
        className="
          bg-violet-200
          rounded-2xl
          p-4
          items-center
          mt-2
        "
      >
        {loading ? (
          <Spinner size="small" color="white" />
        ) : (
          <Text className="font-semibold text-gray-700">
            Login
          </Text>
        )}
      </Pressable>

    </Box>
  );
}