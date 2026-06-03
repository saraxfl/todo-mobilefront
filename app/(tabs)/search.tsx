import { useState } from "react";
import { FlatList, Pressable, TextInput } from "react-native";

import TaskListCard from "@/components/TaskListCard/TaskListCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { getLists } from "@/services/listService";
import { TaskList } from "@/types/TaskList";
import { SafeAreaView } from "react-native-safe-area-context";

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<TaskList[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getLists(query.trim());

      setResults(data);
    } catch {
      setError("No se pudo realizar la búsqueda");
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1 px-6 pt-6">
        <Text className="text-4xl font-bold text-gray-800">
          Search
        </Text>

        <Text className="text-gray-400 mt-1 mb-6">
          Find your lists softly 🐾
        </Text>

        <Box className="bg-pink-50 border border-pink-100 rounded-3xl p-4 mb-6">
          <TextInput
            placeholder="Search lists..."
            value={query}
            onChangeText={setQuery}
            className="bg-white border border-pink-100 rounded-2xl p-4 mb-3"
          />

          <Pressable
            onPress={handleSearch}
            className="bg-violet-200 rounded-2xl p-4 items-center"
          >
            <Text className="text-gray-700 font-semibold">
              Search
            </Text>
          </Pressable>
        </Box>

        {loading && (
          <Box className="items-center mt-8">
            <Spinner size="large" color="#c4b5fd" />
            <Text className="text-gray-400 mt-3">
              Searching...
            </Text>
          </Box>
        )}

        {!loading && error ? (
          <Box className="bg-rose-50 border border-rose-100 rounded-3xl p-5">
            <Text className="text-center text-rose-400">
              {error}
            </Text>
          </Box>
        ) : null}

        {!loading && !error && results.length === 0 && query.length > 0 && (
          <Box className="bg-violet-50 border border-violet-100 rounded-3xl p-6">
            <Text className="text-4xl text-center mb-3">🐱</Text>
            <Text className="text-gray-500 text-center">
              No results found
            </Text>
          </Box>
        )}

        {!loading && !error && results.length > 0 && (
          <FlatList
            data={results}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TaskListCard item={item} />}
            showsVerticalScrollIndicator={false}
          />
        )}
      </Box>
    </SafeAreaView>
  );
}