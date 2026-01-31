import API from "../api";

export const getContacts = async () => {
  const { data } = await API.get("/contacts");
  return data;
};

export const createContact = async (contact) => {
  const { data } = await API.post("/contacts", contact);
  return data;
};

export const deleteContact = async (id) => {
  return API.delete(`/contacts/${id}`);
};
