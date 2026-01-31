import API from "../api";

export const getJournals = async () => {
  const { data } = await API.get("/journals");
  return data;
};

export const createJournal = async (title, text) => {
  const { data } = await API.post("/journals", { title, text });
  return data;
};

export const updateJournal = async (id, title, text) => {
  const { data } = await API.put(`/journals/${id}`, { title, text });
  return data;
};

export const deleteJournal = async (id) => {
  await API.delete(`/journals/${id}`);
};
