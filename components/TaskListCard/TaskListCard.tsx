import { TaskList } from "@/types/TaskList";
import { router } from "expo-router";
import React, { useState } from "react";
import { Text, TextInput } from "react-native";

import { deleteList, updateList } from "@/services/listService";
import { Box } from "../ui/box";
import { Pressable } from "../ui/pressable";
import { Progress, ProgressFilledTrack } from "../ui/progress";

const TaskListCard: React.FC<{
  item: TaskList;
  reload?: () => void;
}> = ({ item, reload }) => {
  const [editing, setEditing] = useState(false);
  const [name, setName] = useState(item.title);
  const [loading, setLoading] = useState(false);

  const handlePress = () => {
    if (editing) return;

    router.push({
      pathname: "/lists/[id]",
      params: {
        id: item.id,
        title: item.title,
      },
    });
  };

  const handleUpdate = async () => {
    try {
      if (!name.trim()) return;

      setLoading(true);

      await updateList(item.id, name.trim());

      setEditing(false);
      reload?.();
    } catch {
      console.log("Error updating list");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);

      await deleteList(item.id);

      reload?.();
    } catch {
      console.log("Error deleting list");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Pressable
      className="p-4 border border-violet-100 bg-white rounded-3xl mb-4"
      onPress={handlePress}
    >
      {editing ? (
        <Box>
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="List name"
            className="bg-pink-50 border border-pink-100 rounded-2xl p-3 mb-3"
          />

          <Box className="flex-row gap-2">
            <Pressable
              onPress={handleUpdate}
              disabled={loading}
              className="bg-violet-200 px-4 py-2 rounded-2xl"
            >
              <Text className="text-gray-700 font-semibold">
                {loading ? "Saving..." : "Save"}
              </Text>
            </Pressable>

            <Pressable
              onPress={() => {
                setEditing(false);
                setName(item.title);
              }}
              className="bg-gray-100 px-4 py-2 rounded-2xl"
            >
              <Text className="text-gray-500 font-semibold">
                Cancel
              </Text>
            </Pressable>
          </Box>
        </Box>
      ) : (
        <>
          <Text className="text-lg font-semibold text-gray-800">
            {item.title}
          </Text>

          <Text className="text-sm text-gray-400 mb-3">
            Tap to see your tasks 🐾
          </Text>

          <Box className="mb-3">
            <Text className="text-xs text-gray-400 mt-1">
  Open to see tasks
</Text>
          </Box>

          <Box className="flex-row gap-2 mt-2">
            <Pressable
              onPress={() => setEditing(true)}
              className="bg-violet-100 px-4 py-2 rounded-2xl"
            >
              <Text className="text-violet-500 font-semibold">
                Edit
              </Text>
            </Pressable>

            <Pressable
              onPress={handleDelete}
              disabled={loading}
              className="bg-rose-100 px-4 py-2 rounded-2xl"
            >
              <Text className="text-rose-500 font-semibold">
                {loading ? "Deleting..." : "Delete"}
              </Text>
            </Pressable>
          </Box>
        </>
      )}
    </Pressable>
  );
};

export default TaskListCard;