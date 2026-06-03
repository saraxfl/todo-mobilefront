import { useRouter } from "expo-router";
import { Pressable } from "react-native";

import { Box } from "@/components/ui/box";
import { Text } from "@/components/ui/text";
import { useAuth } from "../../context/AuthContext";

export default function AboutScreen() {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  return (
    <Box className="flex-1 bg-white px-8 justify-center">
      <Text className="text-5xl text-center mb-4">🐾</Text>

      <Text className="text-3xl font-bold text-center text-gray-800 mb-2">
        Profile
      </Text>

      <Text className="text-center text-gray-400 mb-10">
        Manage your session and app information
      </Text>

      <Pressable
        onPress={handleLogout}
        className="bg-rose-100 rounded-2xl p-4 items-center"
      >
        <Text className="font-semibold text-rose-500">
          Logout
        </Text>
      </Pressable>
    </Box>
  );
}
