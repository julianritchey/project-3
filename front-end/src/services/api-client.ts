import axios, { AxiosRequestConfig } from "axios";

export interface FetchResponse<T> {
  count: number;
  next: string | null;
  results: T[];
}

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  // params: {
  //   key: import.meta.env.VITE_RAWG_API_KEY,
  // },
});

class APIClient<T> {
  endpoint: string;

  constructor(endpoint: string) {
    this.endpoint = endpoint;
  }

  getAll = (config: AxiosRequestConfig) => {
    return axiosInstance.get(this.endpoint, config).then((res) => res.data);
  };

  get = (id: number | string, config: AxiosRequestConfig) => {
    return axiosInstance
      .get(this.endpoint + "/" + id, config)
      .then((res) => res.data);
  };

  backtest = (slug: string, config: AxiosRequestConfig) => {
    return axiosInstance
      .get(this.endpoint + "/" + slug + "/backtest", config)
      .then((res) => res.data);
  };

  notify = (slug: string, config: AxiosRequestConfig) => {
    return axiosInstance
      .get(this.endpoint + "/" + slug + "/notification", config)
      .then((res) => res.data);
  };
}

export default APIClient;
