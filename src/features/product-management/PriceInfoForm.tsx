import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import InputForm from "../../components/ui/InputForm";
import type { Product } from "../../types/business.types";
import { Button, Divider } from "antd";
import { Icon } from "../../components";
import SelectComponent from "../../components/ui/SelectComponent";

const currency = [
  { label: "USD - US Dollar", value: "USD" },
  { label: "EUR - Euro", value: "EUR" },
  { label: "GBP - British Pound", value: "GBP" },
  { label: "JPY - Japanese Yen", value: "JPY" },
  { label: "CAD - Canadian Dollar", value: "CAD" },
  { label: "AUD - Australian Dollar", value: "AUD" },
  { label: "CHF - Swiss Franc", value: "CHF" },
  { label: "CNY - Chinese Yuan", value: "CNY" },
  { label: "MXN - Mexican Peso", value: "MXN" },
  { label: "BRL - Brazilian Real", value: "BRL" },
];

const PriceInfoForm = () => {
  const {
    control,
    formState: { errors },
  } = useFormContext<Product>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "prices",
  });

  return (
    <div className="bg-white p-3">
      <div className="space-y-6">
        {/* Campo de Costo */}
        <div>
          <Controller
            name="cost"
            control={control}
            render={({ field }) => (
              <InputForm
                {...field}
                type="text"
                keyName="cost"
                label="Product Cost"
                placeholder="0.00"
                required
                errors={errors}
              />
            )}
          />
        </div>

        <Divider orientation="left">Sales Prices</Divider>

        {/* Sección de Precios de Venta */}
        <div>
          <div className="space-y-4">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="p-4 bg-slate-50 rounded-lg border border-slate-200"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-1 space-y-4">
                    {/* Label del Precio */}
                    <Controller
                      name={`prices.${index}.label`}
                      control={control}
                      render={({ field }) => (
                        <InputForm
                          {...field}
                          type="text"
                          keyName="label"
                          label="Label"
                          placeholder="e.g. Wholesale Price"
                          required
                          errors={errors.prices?.[index] || {}}
                        />
                      )}
                    />

                    <div
                      className={`grid ${
                        errors.prices?.[index] ? "grid-cols-3" : "grid-cols-2"
                      } gap-4`}
                    >
                      {/* Monto */}
                      <Controller
                        name={`prices.${index}.amount`}
                        control={control}
                        render={({ field }) => (
                          <InputForm
                            {...field}
                            type="text"
                            keyName="amount"
                            label="Amount"
                            placeholder="0.00"
                            required
                            errors={errors.prices?.[index] || {}}
                          />
                        )}
                      />

                      {/* Moneda */}
                      <Controller
                        name={`prices.${index}.currency`}
                        control={control}
                        render={({ field }) => (
                          <SelectComponent
                            {...field}
                            keyName="currency"
                            label="Currency"
                            placeholder="USD"
                            errors={errors.prices?.[index] || {}}
                            required
                            options={currency}
                          />
                        )}
                      />
                    </div>
                  </div>

                  {/* Botón Eliminar */}
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className="mt-8 p-2 text-red-500 hover:bg-red-50 rounded transition"
                      title="Remove price"
                    >
                      <Icon name="Trash2" />
                    </button>
                  )}
                </div>
              </div>
            ))}

            {/* Botón Agregar Precio */}
            <Button
              type="dashed"
              icon={<Icon name="Plus" />}
              block
              onClick={() =>
                append({
                  label: "",
                  amount: 0,
                  currency: "USD",
                })
              }
              className="text-blue-500 border-blue-500 hover:bg-blue-50"
            >
              Add Another Price
            </Button>
          </div>

          {/* Error general del array de precios */}
          {errors.prices && typeof errors.prices.message === "string" && (
            <p className="mt-2 text-sm text-red-500">{errors.prices.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PriceInfoForm;
