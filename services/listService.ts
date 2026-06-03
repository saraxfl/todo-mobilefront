import api from "./api";

export const getLists = async (search?: string) => {
  const response = await api.get("/list", {
    params: {
      q: search,
    },
  });

  return response.data.map((item: any) => ({
    id: item.id,
    title: item.name,
    subtitle: "",
    percentage: 0,
    tags: [],
    idColor: "bg-violet-200",
    idIcon: "list",
  }));
};

export const getListById = async (id: string, search?: string) => {
  const response = await api.get(`/list/${id}`, {
    params: {
      q: search,
    },
  });

  return response.data;
};


export const createList = async (name: string) => {
  const response = await api.post("/list", {
    name,
  });

  return response.data;
};


export const updateList = async (
  id: string,
  name: string
) => {
  const response = await api.patch(
    `/list/${id}`,
    {
      name,
    }
  );

  return response.data;
};

export const deleteList = async (
  id: string
) => {
  await api.delete(
    `/list/${id}`
  );
};