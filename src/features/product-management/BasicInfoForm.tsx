import { Controller, useFieldArray, useFormContext } from "react-hook-form";
import type { Product } from "../../types/business.types";
import { Button, Divider, message, Upload } from "antd";
import { useState } from "react";
import { Icon } from "../../components";
import InputForm from "../../components/ui/InputForm";

export type BasicProductInfo = Pick<
  Product,
  "name" | "description" | "sku" | "createdAt" | "updatedAt" | "images"
>;

const BasicInfoForm = () => {
  const [_, setImagePreviewUrl] = useState(null);

  const { 
    control,
    watch,
    formState: { errors },
  } = useFormContext<Product>(); // Usa el tipo Product del formulario principal

  // El resto del código de useFieldArray y las funciones permanecen IGUAL,
  // pero ahora usan el `control` y los `errors` del formulario principal.

  const { fields, append, remove } = useFieldArray({
    control, // Este control ahora viene del FormProvider
    name: "images",
  });

  const images = watch("images");

  const handleImageUpload = (file: any) => {
    const reader = new FileReader();
    reader.onload = (e: any) => {
      const dataUrl = e.target.result;
      setImagePreviewUrl(dataUrl);
      append({
        url: dataUrl,
        alt: "",
      });
      message.success("Imagen agregada correctamente");
    };
    reader.readAsDataURL(file);
    return false;
  };

  return (
    <div className="bg-white p-3">
      <div className="space-y-6">
        {/* Campo Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre del Producto *
          </label>
          <Controller
            name="name"
            control={control}
            render={({ field }) => (
              <InputForm keyName="name" placeholder="Ej: Laptop Gaming Pro" errors={errors} type="text" {...field}/>
            )}
          />
        </div>

        {/* Campo SKU */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            SKU (Código del Producto) *
          </label>
          <Controller
            name="sku"
            control={control}
            render={({ field }) => (
              <InputForm keyName="sku" placeholder="Ej: SKU-001-LAPTOP" errors={errors} type="text" {...field}/>
            )}
          />
        </div>

        {/* Campo Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <InputForm keyName="description" placeholder="Describe las caracteristicas de tu producto..." errors={errors} type="textarea" {...field}/>
            )}
          />
        </div>

        <Divider className="my-6" />

        {/* Sección de Imágenes */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-4">
            Imágenes del Producto
          </label>

          {fields.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
              <Icon
                name="Camera"
                className="w-8 h-8 text-slate-400 mx-auto mb-2"
              />
              <p className="text-slate-500 mb-4">No hay imágenes agregadas</p>
              <Upload
                accept="image/*"
                beforeUpload={handleImageUpload}
                showUploadList={false}
              >
                <Button
                  type="dashed"
                  icon={<Icon name="Plus" className="w-4 h-4" />}
                  className="text-blue-500 border-blue-500 hover:bg-blue-50"
                >
                  Subir Primera Imagen
                </Button>
              </Upload>
            </div>
          ) : (
            <div className="space-y-4">
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-4 p-4 bg-slate-50 rounded-lg border border-slate-200"
                >
                  <div className="flex-1">
                    <div className="mb-3">
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        URL de la Imagen
                      </label>
                      <Controller
                        name={`images.${index}.url`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="https://ejemplo.com/imagen.jpg"
                            className={`w-full px-3 py-2 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
                              errors.images?.[index]?.url
                                ? "border-red-500"
                                : "border-slate-300"
                            }`}
                            readOnly
                          />
                        )}
                      />
                      {errors.images?.[index]?.url && (
                        <p className="mt-1 text-xs text-red-500">
                          {errors.images[index].url.message}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-slate-600 mb-1">
                        Texto Alternativo (ALT)
                      </label>
                      <Controller
                        name={`images.${index}.alt`}
                        control={control}
                        render={({ field }) => (
                          <input
                            {...field}
                            type="text"
                            placeholder="Describe la imagen..."
                            className="w-full px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                          />
                        )}
                      />
                    </div>

                    {(images?.[index]?.url ?? false) && (
                      <div className="mt-3">
                        <img
                          src={images?.[index]?.url}
                          alt={images?.[index]?.alt || "Preview"}
                          className="h-24 w-24 object-cover rounded border border-slate-300"
                        />
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="mt-8 p-2 text-red-500 hover:bg-red-50 rounded transition"
                    title="Eliminar imagen"
                  >
                    <Icon name="Trash2" className="w-5 h-5" />
                  </button>
                </div>
              ))}

              <Upload
                accept="image/*"
                beforeUpload={handleImageUpload}
                showUploadList={false}
              >
                <Button
                  type="dashed"
                  icon={<Icon name="Plus" className="w-4 h-4" />}
                  block
                  className="text-blue-500 border-blue-500 hover:bg-blue-50 mt-4"
                >
                  Agregar Otra Imagen
                </Button>
              </Upload>
            </div>
          )}
          {errors.images && (
            <p className="mt-2 text-sm text-red-500">{errors.images.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default BasicInfoForm;
