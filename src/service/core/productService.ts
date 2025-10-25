import axiosClient from "../../api/axiosClient";
import { useMessageStore } from "../../store/MessageStore";
import type { Product } from "../../types/business.types";
import axios, { type AxiosResponse, AxiosError } from "axios";

// Define la estructura de error de tu API
interface ApiErrorResponse {
  message: string;
  error?: string;
  status?: number;
}

export const productsService = {
  getAll: async (signal?: AbortSignal): Promise<Product[]> => {
    try {
        // Pasamos el signal para que axios pueda escuchar cuando cancelemos la operacion
      const res: AxiosResponse<Product[]> = await axiosClient.get("/products", {
        signal,
      });
      return res.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error; // No mostrar notificación si fue cancelado
      }
      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Error al cargar productos";

      const api = useMessageStore.getState().api;
      api?.error({
        message: "Error",
        description: errorMessage,
      });

      throw new Error(errorMessage);
    }
  },

  getById: async (id: string | number) => {
    const { data } = await axiosClient.get(`/products/${id}`);
    return data;
  },

  create: async (payload: Product) => {
    const { data } = await axiosClient.post("/products/new", payload);
    return data;
  },

  update: async (id: string | number, payload: Product) => {
    const { data } = await axiosClient.put(`/products/${id}`, payload);
    return data;
  },

  delete: async (id: string | number) => {
    const { data } = await axiosClient.delete(`/products/${id}`);
    return data;
  },
};
