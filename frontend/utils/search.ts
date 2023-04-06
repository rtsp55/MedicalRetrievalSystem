import axios from "axios";
import https from "https";

export const api = axios.create({
  baseURL: "https://asia-southeast2-ask-med.cloudfunctions.net",
  httpAgent: new https.Agent({ keepAlive: true }),
});

export const search = async (query: string) => {
  try {
    const { data } = await api.get<SearchResult>(`/search?q=${query}`);
    return Promise.resolve(data);
  } catch (e) {
    console.log(e);
    return Promise.reject();
  }
};
