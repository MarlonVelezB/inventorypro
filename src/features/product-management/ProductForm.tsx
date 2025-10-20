// ProductForm.tsx (Componente Principal)
import { useForm, FormProvider } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { Product } from "../../types/business.types";
import { CombinedProductSchema } from "./validation/CompleteProductSchema";
import { Button, Tabs, type TabsProps } from "antd";
import BasicInfoForm from "./BasicInfoForm";
import PriceInfoForm from "./PriceInfoForm";
import InventoryInfoForm from "./InventoryInfoForm";
import CustomAttributeForm from "./CustomAttributeForm";
import { Icon } from "../../components";
import type { IconName } from "../../types/component.types";
import useErrorStore from "../../store/ErrorStore";

const ProductForm = () => {
  const methods = useForm<Product>({
    resolver: yupResolver(CombinedProductSchema),
  });

  const { submitErrors } = useErrorStore();

  const onSubmit = (data: Product) => {
    // Si llegamos aquí, TODOS los campos de todas las pestañas son VÁLIDOS.
    console.log("Datos del Producto Válidos y Completos:", data);
  };

  const headerTab = ({ title, icon }: { title: string; icon?: IconName }) => {
    return (
      <div className="flex items-center gap-1">
        {icon && <Icon name={icon} size={16} />}
        <span>{title}</span>
      </div>
    );
  };

  const items: TabsProps["items"] = [
    {
      key: "1",
      label: headerTab({ title: "Basic Info", icon: "Info" }),
      children: <BasicInfoForm />,
    },
    {
      key: "2",
      label: headerTab({ title: "Prices", icon: "DollarSign" }),
      children: <PriceInfoForm />,
    },
    //
    {
      key: "3",
      label: headerTab({ title: "Inventory", icon: "Box" }),
      children: <InventoryInfoForm />,
    },
    {
      key: "4",
      label: headerTab({ title: "Custom Attributes", icon: "Columns3Cog" }),
      children: <CustomAttributeForm />,
    },
  ];

  const handleError = (errors: any) => {
    console.error("❌ Errores de validación:", errors);
    submitErrors(Object.entries(errors));
  };

  return (
    <div>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit, handleError)}>
          <Tabs defaultActiveKey="1" items={items} />
          {/* El botón de SUBMIT que valida todo */}
          <div className="flex justify-end mt-6">
            <Button
              htmlType="submit"
              type="primary"
              icon={<Icon name="Check" size={20} />}
              size="large"
            >
              Validate and Save
            </Button>
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default ProductForm;
