import axiosClient from "../../api/axiosClient";
import { useMessageStore } from "../../store/MessageStore";
import type { Warehouse } from "../../types/business.types";
import axios, { type AxiosResponse, AxiosError } from "axios";

interface ApiErrorResponse {
  message: string;
  errors?: any[];
  details?: string;
}

export const warehousesService = {
  getAll: async (signal?: AbortSignal): Promise<Warehouse[]> => {
    try {
      const res: AxiosResponse<Warehouse[]> = await axiosClient.get("/warehouses", {
        signal,
      });
      return res.data;
    } catch (error) {
      if (axios.isCancel(error)) throw error;

      const axiosError = error as AxiosError<ApiErrorResponse>;
      const errorMessage =
        axiosError.response?.data?.message || "Error al cargar bodegas";

      const api = useMessageStore.getState().api;
      api?.error({
        message: "Error",
        description: errorMessage,
      });

      throw new Error(errorMessage);
    }
  },

  getById: async (id: string | number) => {
    const { data } = await axiosClient.get(`/warehouses/${id}`);
    return data;
  },

  create: async (payload: Warehouse): Promise<Warehouse> => {
    try {
      const res: AxiosResponse<Warehouse> = await axiosClient.post(
        "/warehouses/new",
        payload
      );
      return res.data;
    } catch (error) {
      if (axios.isCancel(error)) throw error;

      const axiosError = error as AxiosError<ApiErrorResponse>;
      const api = useMessageStore.getState().api;

      if (axiosError.response) {
        const { data } = axiosError.response;
        const errorMessage =
          data.message || "Error al crear la bodega (Detalle desconocido)";

        api?.error({
          message: "Error",
          description: errorMessage,
        });

        throw new Error(errorMessage);
      } else {
        const networkErrorMessage = "Error de red o conexión al servidor.";
        api?.error({
          message: "Error de Conexión",
          description: networkErrorMessage,
        });
        throw new Error(networkErrorMessage);
      }
    }
  },

  update: async (id: string | number, payload: Warehouse): Promise<Warehouse> => {
    const { data } = await axiosClient.put(`/warehouses/${id}`, payload);
    return data;
  },

  delete: async (id: string | number) => {
    const { data } = await axiosClient.delete(`/warehouses/${id}`);
    return data;
  },

  createBatch: async (
    warehouses: Warehouse[],
    signal?: AbortSignal
  ): Promise<{ message: string; count: number; data: Warehouse[] }> => {
    try {
      const res: AxiosResponse<{ message: string; count: number; data: Warehouse[] }> =
        await axiosClient.post("/warehouses/batch", warehouses, { signal });

      return res.data;
    } catch (error) {
      if (axios.isCancel(error)) throw error;

      const axiosError = error as AxiosError<ApiErrorResponse>;
      const responseData = axiosError.response?.data;

      let errorMessage =
        responseData?.message || "Error desconocido al procesar el lote de bodegas.";
      const errorDetail = responseData?.errors?.map((e) => e.message).join("; ") || "";

      const api = useMessageStore.getState().api;
      api?.error({
        message: "Fallo de Creación de Lote",
        description: errorDetail || errorMessage,
      });

      throw new Error(errorMessage);
    }
  },
};
