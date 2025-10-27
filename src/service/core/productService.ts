import axiosClient from "../../api/axiosClient";
import { useMessageStore } from "../../store/MessageStore";
import type { Product } from "../../types/business.types";
import axios, { type AxiosResponse, AxiosError } from "axios";

interface WarehouseValidationError {
  warehouseId: string;
  message: string;
}

interface BatchWarehouseValidationError extends WarehouseValidationError {
  productIndex: number;
  productName: string;
}

interface BatchCreationResponse {
  message: string;
  count: number;
  data: Product[]; // Los productos creados con sus nuevos IDs
}

interface ApiErrorResponse {
  message: string;
  errors?: (WarehouseValidationError | BatchWarehouseValidationError | any)[];
  details?: string;
  productAttempted?: { id: string; name: string };
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

  create: async (payload: Product): Promise<Product> => {
    try {
      // 1. Petición exitosa: si regresa 201, retorna los datos.
      const res: AxiosResponse<Product> = await axiosClient.post(
        "/products/new",
        payload
      );
      return res.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error; // No mostrar notificación si fue cancelado
      }

      const axiosError = error as AxiosError<ApiErrorResponse>;
      const api = useMessageStore.getState().api;

      // 2. Manejo de errores 400 y 500
      if (axiosError.response) {
        const { status, data } = axiosError.response;

        // --- CASO 400: Error de Validación de Bodegas ---
        if (status === 400 && data.errors && data.errors.length > 0) {
          const detailedMessage = data.errors
            .map((err) => `Bodega ID: ${err.warehouseId} - ${err.message}`)
            .join("\n"); // Une los errores en una lista con saltos de línea

          // Mensaje corto para el título de la notificación
          const titleMessage = data.message || "Error de validación de stock.";

          // Muestra el error detallado al usuario
          api?.error({
            message: titleMessage,
            description: `El producto no pudo crearse debido a las siguientes bodegas:\n${detailedMessage}`,
            duration: 8, // Da más tiempo para leer el detalle
          });

          // Lanza un error con el mensaje principal para manejar el flujo de la UI (ej. evitar cerrar el modal)
          throw new Error(titleMessage);
        }

        // --- CASO 500 o 4xx Genérico (No-Validación) ---
        else {
          const errorMessage =
            data.message || "Error al crear el producto (Detalle desconocido)";

          // Muestra el error genérico
          api?.error({
            message: "Error",
            description: errorMessage,
          });

          throw new Error(errorMessage);
        }
      }

      // 3. Manejo de errores de red (sin respuesta)
      else {
        const networkErrorMessage = "Error de red o conexión al servidor.";
        api?.error({
          message: "Error de Conexión",
          description: networkErrorMessage,
        });
        throw new Error(networkErrorMessage);
      }
    }
  },

  createBatch: async (
    products: Product[],
    signal?: AbortSignal
  ): Promise<BatchCreationResponse> => {
    try {
      // Usamos POST para enviar el arreglo 'products' al endpoint de lote
      const res: AxiosResponse<BatchCreationResponse> = await axiosClient.post(
        "/products/batch",
        products,
        {
          signal,
        }
      );

      // Si la respuesta es 201 (Created), retornamos los datos de éxito
      return res.data;
    } catch (error) {
      if (axios.isCancel(error)) {
        throw error; // Evitar notificaciones si la operación fue cancelada
      }

      // --- 🚨 Manejo Uniforme del Error Atómico (Usando ApiErrorResponse) ---

      const axiosError = error as AxiosError<ApiErrorResponse>;
      const responseData = axiosError.response?.data;

      // Mensaje por defecto en caso de error desconocido
      let errorMessage =
        responseData?.message || "Error desconocido al procesar el lote.";
      let errorDetail = "";

      // Si hay errores específicos (ej. WarehouseValidationError)
      if (responseData?.errors && responseData.errors.length > 0) {
        // Concatenamos los mensajes de error de validación (ej. bodega no existe)
        errorDetail = responseData.errors
          .map((err) => {
            // Aquí diferenciamos si es un error de lote específico (BatchWarehouseValidationError)
            if ((err as BatchWarehouseValidationError).productName) {
              return `Producto ${
                (err as BatchWarehouseValidationError).productName
              } (ID: ${(err as BatchWarehouseValidationError).warehouseId}): ${
                err.message
              }`;
            }
            return err.message;
          })
          .join("; ");

        errorMessage =
          responseData.message || "Fallo de validación en una o más bodegas.";
      }

      // Mostrar notificación usando la tienda de mensajes
      const api = useMessageStore.getState().api;
      api?.error({
        message: "Fallo de Creación Atómica",
        // Mostramos los detalles del error para el usuario
        description: errorDetail || errorMessage,
      });

      // Lanzamos un error con el mensaje principal para el componente que llama
      throw new Error(errorMessage);
    }
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
