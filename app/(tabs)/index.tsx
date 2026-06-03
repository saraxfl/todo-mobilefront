import { useEffect, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  TextInput,
} from "react-native";

import TaskListCard from "@/components/TaskListCard/TaskListCard";
import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";

import {
  createList,
  getLists,
} from "@/services/listService";

import { TaskList } from "@/types/TaskList";

import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  const [lists, setLists] = useState<TaskList[]>([]);

  const [loading, setLoading] = useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [newListName, setNewListName] =
    useState("");

  const [creating, setCreating] =
    useState(false);

  const loadLists = async () => {
    try {
      setError(null);

      const data = await getLists();

      setLists(data);
    } catch {
      setError(
        "No se pudieron cargar tus listas"
      );

      setLists([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);

    await loadLists();
  };

  const handleCreateList = async () => {
    try {
      if (!newListName.trim()) {
        setError(
          "Escribe un nombre para la lista"
        );

        return;
      }

      setCreating(true);

      setError(null);

      await createList(
        newListName.trim()
      );

      setNewListName("");

      await loadLists();
    } catch {
      setError(
        "No se pudo crear la lista"
      );
    } finally {
      setCreating(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Box className="flex-1 px-6 pt-6">

        {/* HEADER */}

        <Box className="mb-6">
          <Text className="text-4xl font-bold text-gray-800">
            My Lists
          </Text>

          <Text className="text-gray-400 mt-1">
            Keep your tasks soft, simple and organized 🐾
          </Text>
        </Box>

        {/* CREATE LIST */}

        <Box className="bg-pink-50 border border-pink-100 rounded-3xl p-4 mb-6">

          <Text className="text-gray-700 font-semibold mb-3">
            Create a new list 🐱
          </Text>

          <TextInput
            placeholder="List name"
            value={newListName}
            onChangeText={setNewListName}
            className="
              bg-white
              border
              border-pink-100
              rounded-2xl
              p-4
              mb-3
            "
          />

          <Pressable
            onPress={handleCreateList}
            disabled={creating}
            className="
              bg-violet-200
              rounded-2xl
              p-4
              items-center
            "
          >
            <Text className="text-gray-700 font-semibold">
              {creating
                ? "Creating..."
                : "Create list"}
            </Text>
          </Pressable>

        </Box>

        {/* LOADING */}

        {loading && (
          <Box className="flex-1 items-center justify-center">

            <Spinner
              size="large"
              color="#c4b5fd"
            />

            <Text className="text-gray-400 mt-4">
              Loading your lists...
            </Text>

          </Box>
        )}

        {/* ERROR */}

        {!loading && error && (
          <Box className="bg-rose-50 border border-rose-100 rounded-3xl p-5">

            <Text className="text-3xl text-center mb-2">
              🐱
            </Text>

            <Text className="text-center text-rose-400 mb-4">
              {error}
            </Text>

            <Pressable
              onPress={loadLists}
              className="
                bg-rose-100
                rounded-2xl
                p-4
                items-center
              "
            >
              <Text className="text-rose-500 font-semibold">
                Retry
              </Text>
            </Pressable>

          </Box>
        )}

        {/* EMPTY */}

        {!loading &&
          !error &&
          lists.length === 0 && (

          <Box className="bg-violet-50 border border-violet-100 rounded-3xl p-6 mt-4">

            <Text className="text-4xl text-center mb-3">
              🐾
            </Text>

            <Text className="text-gray-600 text-center font-semibold">
              No lists yet
            </Text>

            <Text className="text-gray-400 text-center mt-1">
              Create your first task list.
            </Text>

          </Box>
        )}

        {/* LISTS */}

        {!loading &&
          !error &&
          lists.length > 0 && (

          <FlatList
            data={lists}

            keyExtractor={(item) =>
              item.id
            }

            renderItem={({ item }) => (
              <TaskListCard
                item={item}
                reload={loadLists}
              />
            )}

            showsVerticalScrollIndicator={false}

            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
          />
        )}

      </Box>
    </SafeAreaView>
  );
}