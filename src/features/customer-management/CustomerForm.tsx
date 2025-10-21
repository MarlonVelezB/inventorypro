import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  customerSchema,
  type CustomerFormData,
  type FormValues,
} from "./validation/CustomerFormValidationSchema";
import InputForm from "../../components/ui/InputForm";
import { Button, Input } from "antd";
import { Icon } from "../../components";
import useModalStore from "../../store/ModalStore";
import { useState } from "react";
import { mockClients } from "../../utils/testData";
import type { Customer } from "../../types/business.types";
import { useMessageStore } from "../../store/MessageStore";

interface CustomerFormProps {
  mode: "create" | "edit";
  initialData?: FormValues;
  onSubmit: (data: CustomerFormData) => void;
  isLoading?: boolean;
}

const CustomerForm: React.FC<CustomerFormProps> = ({
  mode,
  initialData,
  onSubmit,
  isLoading = false,
}) => {
  const [customerCode, setCustomerCode] = useState("");
  const [disableInputCode, setDisableInputCode] = useState(true);
  const api = useMessageStore((state) => state.api);
  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(customerSchema),
    defaultValues: {
      name: initialData?.name || "",
      lastname: initialData?.lastname || "",
      email: initialData?.email || "",
      phone: initialData?.phone || "",
      dni: initialData?.dni || "",
      address: initialData?.address || "",
      status: initialData?.status || "pending",
    },
  });

  const [name, lastname] = watch(["name", "lastname"]);

  const onSubmitForm = (data: FormValues) => {
    const payload: CustomerFormData = {
      ...(data as any),
      createdAt: (initialData as any)?.createdAt ?? new Date().toISOString(),
      updatedAt: (initialData as any)?.updatedAt ?? new Date().toISOString(),
    };
    onSubmit(payload);
  };

  const handleChangeInput = (nameValue?: string, lastnameValue?: string) => {
    const n = nameValue ?? name ?? "";
    const l = lastnameValue ?? lastname ?? "";

    // Obtener iniciales (con validación)
    const initials = `${n.charAt(0) || ""}${l.charAt(0) || ""}`.toUpperCase();

    // Si no hay iniciales válidas, no generar código
    if (initials.length < 2) {
      setCustomerCode("");
      return;
    }

    // Filtrar todos los clientes que tienen las mismas iniciales
    const customersWithSameInitials = mockClients.filter((customer: Customer) =>
      customer.code.startsWith(initials)
    );

    // Si no hay clientes con esas iniciales, empezar en 001
    if (customersWithSameInitials.length === 0) {
      setCustomerCode(`${initials}001`);
      return;
    }

    // Extraer todos los números de los códigos existentes
    const existingNumbers = customersWithSameInitials
      .map((customer: Customer) => {
        // Remover las iniciales y obtener solo el número
        const numberPart = customer.code.slice(initials.length);
        return parseInt(numberPart, 10);
      })
      .filter((num) => !isNaN(num)); // Filtrar números inválidos

    // Encontrar el número más alto y sumar 1
    const maxNumber = Math.max(...existingNumbers, 0);
    const nextNumber = maxNumber + 1;

    // Formatear el número con ceros a la izquierda (mínimo 3 dígitos)
    const formattedNumber = nextNumber.toString().padStart(3, "0");

    setCustomerCode(`${initials}${formattedNumber}`);
  };

  const handleChangeCustomerCode = () => {
    if (disableInputCode) {
      setDisableInputCode(false);
    } else {
      const customerMatchCode = mockClients.filter(
        (customer: Customer) => customer.code === customerCode
      );

      if (customerMatchCode.length > 0) {
        setCustomerCode("");
        api?.error({
          message: "Duplicate Code",
          description: "This code already exists. Please use a different one.",
          placement: "top",
        });
      } else {
        setDisableInputCode(true);
      }
    }
  };

  const { closeModal } = useModalStore();

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="bg-card px-6 py-4">
      <div className="space-y-4">
        {/* Code (Read-only) */}

        <div className="flex flex-col gap-y-2">
          <label
            className="block text-sm font-medium text-slate-700 mb-2"
            htmlFor="code"
          >
            Código de Cliente
          </label>
          <div className="flex items-center gap-2">
            <Input
              id="code"
              type="text"
              value={customerCode}
              disabled={disableInputCode}
              onChange={(value) =>
                setCustomerCode(value.target.value.toUpperCase())
              }
              placeholder="Código único generado automáticamente"
            />
            <Button
              type="text"
              onClick={() => handleChangeCustomerCode()}
              disabled={customerCode.length === 0}
            >
              {disableInputCode === true ? (
                <span>Edit Code</span>
              ) : (
                <Icon name="Check" size={20} />
              )}
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <div>
                <InputForm
                  {...field}
                  type="text"
                  keyName="name"
                  label="Nombre"
                  placeholder="Ingresa el nombre"
                  onChange={(e: any) => {
                    field.onChange(e);
                    const val = e?.target?.value ?? e;
                    handleChangeInput(val, undefined);
                  }}
                  required
                  errors={errors}
                />
              </div>
            )}
          />
          <Controller
            name="lastname"
            control={control}
            render={({ field }) => (
              <div>
                <InputForm
                  {...field}
                  type="text"
                  keyName="lastname"
                  label="Apellido"
                  placeholder="Ingresa el apellido"
                  onChange={(e: any) => {
                    field.onChange(e);
                    const val = e?.target?.value ?? e;
                    handleChangeInput(undefined, val);
                  }}
                  required
                  errors={errors}
                />
              </div>
            )}
          />
        </div>

        {/* Email */}
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <InputForm
              {...field}
              type="email"
              keyName="email"
              label="Email"
              placeholder="ejemplo@correo.com"
              required
              errors={errors}
            />
          )}
        />

        {/* Phone and DNI */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Controller
            name="phone"
            control={control}
            render={({ field }) => (
              <div>
                <InputForm
                  {...field}
                  type="tel"
                  keyName="phone"
                  label="Teléfono"
                  placeholder="+34 123 456 789"
                  required
                  errors={errors}
                />
              </div>
            )}
          />
          <Controller
            name="dni"
            control={control}
            render={({ field }) => (
              <div>
                <InputForm
                  {...field}
                  type="text"
                  keyName="dni"
                  label="DNI"
                  placeholder="12345678A"
                  required
                  errors={errors}
                />
              </div>
            )}
          />
        </div>

        {/* Address */}
        <Controller
          name="address"
          control={control}
          render={({ field }) => (
            <InputForm
              {...field}
              type="text"
              keyName="address"
              label="Dirección"
              placeholder="Calle, número, ciudad, código postal"
              required
              errors={errors}
            />
          )}
        />
      </div>

      {/* Actions */}
      <div className="flex items-center justify-end space-x-3 mt-6 pt-4 border-t border-border">
        <Button variant="outlined" onClick={closeModal} disabled={isLoading}>
          Cancelar
        </Button>
        <Button
          htmlType="submit"
          loading={isLoading}
          icon={
            <Icon name="Save" size={16} className="text(--color-primary)" />
          }
          iconPosition="start"
        >
          {mode === "edit" ? "Actualizar" : "Crear"} Cliente
        </Button>
      </div>
    </form>
  );
};

export default CustomerForm;
