import * as yup from "yup";
import type { Customer } from "../../../types/business.types";

export const customerSchema = yup.object({
  code: yup.string(),
  name: yup.string().required("El nombre es requerido"),
  lastname: yup.string().required("El apellido es requerido"),
  email: yup
    .string()
    .email("Email inválido")
    .required("El email es requerido"),
  phone: yup.string().required("El teléfono es requerido"),
  dni: yup.string().required("El DNI es requerido"),
  address: yup.string().required("La dirección es requerida"),
  status: yup
    .string()
    .oneOf(["pending", "active", "inactive"], "Estado inválido")
    .required("El estado es requerido"),
});

export type CustomerFormData = Omit<Customer, "id">;

  export type FormValues = {
    code?: string;
    name: string;
    lastname: string;
    email: string;
    phone: string;
    dni: string;
    address: string;
    status: "pending" | "active" | "inactive";
  };