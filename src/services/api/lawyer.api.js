import api from "../api";
export const getLawyers = (params) => {
  return api.get("/client/lawyers", { params });
};

export const getLawyer = (id) => {
  return api.get(`/client/lawyers/${id}`);
};


