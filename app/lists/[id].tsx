import { Progress, ProgressFilledTrack } from "@/components/ui/progress";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Pressable, TextInput } from "react-native";

import { Box } from "@/components/ui/box";
import { Spinner } from "@/components/ui/spinner";
import { Text } from "@/components/ui/text";
import { getListById } from "@/services/listService";
import { createTodo, deleteTodo, updateTodo } from "@/services/todoService";

type Task = {
  id: string;
  title: string;
  completed: boolean;
  dueDate: string;
};

type Params = {
  id: string;
  title?: string;
};

export default function TasksScreen() {
  const { id, title } = useLocalSearchParams<Params>();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [listTitle, setListTitle] = useState(title ?? "Task List");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskDescription, setNewTaskDescription] = useState("");
  const [creatingTask, setCreatingTask] = useState(false);

  const loadListDetail = async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await getListById(String(id));

      setListTitle(data.name ?? title ?? "Task List");
      setTasks(data.todos ?? []);
    } catch {
      setError("No se pudieron cargar las tareas");
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadListDetail();
  }, [id]);

  const handleCreateTask = async () => {
    try {
      if (!newTaskTitle.trim() || !newTaskDescription.trim()) {
        setError("Escribe título y descripción");
        return;
      }

      setCreatingTask(true);
      setError(null);

      await createTodo(
        newTaskTitle.trim(),
        newTaskDescription.trim(),
        new Date(Date.now() + 86400000).toISOString(),
        String(id)
      );

      setNewTaskTitle("");
      setNewTaskDescription("");

      await loadListDetail();
    } catch {
      setError("No se pudo crear la tarea");
    } finally {
      setCreatingTask(false);
    }
  };

  const handleToggle = async (task: Task) => {
    try {
      await updateTodo(task.id, {
        completed: !task.completed,
      });

      await loadListDetail();
    } catch {
      setError("No se pudo actualizar la tarea");
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTodo(taskId);

      await loadListDetail();
    } catch {
      setError("No se pudo eliminar la tarea");
    }
  };

  const completedCount = tasks.filter((task) => task.completed).length;

  const percentage =
    tasks.length === 0
      ? 0
      : Math.round((completedCount / tasks.length) * 100);

  return (
    <>
      <Stack.Screen
        options={{
          title: listTitle,
          headerBackButtonDisplayMode: "minimal",
        }}
      />

      <Box className="flex-1 bg-white px-6 pt-6">
        <Box className="bg-violet-50 border border-violet-100 p-5 rounded-3xl mb-5">
          <Text className="text-3xl mb-2">🐾</Text>

          <Text className="text-gray-800 text-2xl font-bold mb-1">
            {listTitle}
          </Text>

          <Text className="text-gray-400 text-sm mb-5">
            {tasks.length} tasks in this list
          </Text>

          <Progress value={percentage}>
            <ProgressFilledTrack />
          </Progress>

          <Text className="text-gray-500 text-xs mt-2">
            {percentage}% completed
          </Text>
        </Box>

        <Box className="bg-pink-50 border border-pink-100 rounded-3xl p-4 mb-5">
          <Text className="font-semibold mb-3 text-gray-700">
            Add task 🐱
          </Text>

          <TextInput
            placeholder="Task title"
            value={newTaskTitle}
            onChangeText={setNewTaskTitle}
            className="bg-white border border-pink-100 rounded-2xl p-3 mb-3"
          />

          <TextInput
            placeholder="Description"
            value={newTaskDescription}
            onChangeText={setNewTaskDescription}
            className="bg-white border border-pink-100 rounded-2xl p-3 mb-3"
          />

          <Pressable
            onPress={handleCreateTask}
            disabled={creatingTask}
            className="bg-violet-200 p-3 rounded-2xl items-center"
          >
            <Text className="text-gray-700 font-semibold">
              {creatingTask ? "Creating..." : "Add task"}
            </Text>
          </Pressable>
        </Box>

        <Box className="flex-row justify-between items-center mb-4">
          <Text className="text-sm font-semibold text-gray-500">
            TASKS
          </Text>

          <Box className="bg-pink-50 px-3 py-1 rounded-full">
            <Text className="text-xs text-gray-500">
              {tasks.length - completedCount} remaining
            </Text>
          </Box>
        </Box>

        {loading && (
          <Box className="flex-1 items-center justify-center">
            <Spinner size="large" color="#c4b5fd" />
            <Text className="text-gray-400 mt-4">Loading tasks...</Text>
          </Box>
        )}

        {!loading && error && (
          <Box className="bg-rose-50 border border-rose-100 rounded-3xl p-5 mb-4">
            <Text className="text-center text-rose-400 mb-4">
              {error}
            </Text>

            <Pressable
              onPress={loadListDetail}
              className="bg-rose-100 rounded-2xl p-4 items-center"
            >
              <Text className="text-rose-500 font-semibold">Retry</Text>
            </Pressable>
          </Box>
        )}

        {!loading && !error && tasks.length === 0 && (
          <Box className="bg-pink-50 border border-pink-100 rounded-3xl p-6">
            <Text className="text-4xl text-center mb-3">🐱</Text>

            <Text className="text-center text-gray-600 font-semibold">
              No tasks yet
            </Text>

            <Text className="text-center text-gray-400 mt-1">
              Add your first task to this list.
            </Text>
          </Box>
        )}

        {!loading && !error && tasks.length > 0 && (
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <Box className="bg-white border border-violet-100 rounded-3xl p-4 mb-3">
                <Text className="text-gray-800 font-semibold text-lg">
                  {item.title}
                </Text>

                <Text className="text-gray-400 text-xs mt-1">
                  Due: {item.dueDate?.slice(0, 10)}
                </Text>

                <Text className="text-gray-500 mt-2">
                  {item.completed ? "Completed 🐾" : "Pending"}
                </Text>

                <Box className="flex-row gap-2 mt-4">
                  <Pressable
                    onPress={() => handleToggle(item)}
                    className="bg-violet-100 px-4 py-2 rounded-2xl"
                  >
                    <Text className="text-violet-500 font-semibold">
                      {item.completed ? "Undo" : "Complete"}
                    </Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleDeleteTask(item.id)}
                    className="bg-rose-100 px-4 py-2 rounded-2xl"
                  >
                    <Text className="text-rose-500 font-semibold">
                      Delete
                    </Text>
                  </Pressable>
                </Box>
              </Box>
            )}
          />
        )}
      </Box>
    </>
  );
}