import api from "./api";

export const createTodo = async (
  title: string,
  description: string,
  dueDate: string,
  listId: string
) => {
  const response = await api.post("/todo", {
    title,
    description,
    dueDate,
    listId,
  });

  return response.data;
};

export const updateTodo = async (
  id: string,
  body: {
    title?: string;
    description?: string;
    completed?: boolean;
    dueDate?: string;
    listId?: string;
  }
) => {
  const response = await api.patch(`/todo/${id}`, body);

  return response.data;
};

export const deleteTodo = async (id: string) => {
  await api.delete(`/todo/${id}`);
};