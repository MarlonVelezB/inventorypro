import { Controller, useFormContext } from "react-hook-form";
import InputForm from "../../components/ui/InputForm";
import type {
  Product,
  Warehouse,
  WarehouseStock,
} from "../../types/business.types";
import { warehouses } from "../../utils/testData";
import { Button, Divider, Input, message, Select, Switch } from "antd";
import { Icon } from "../../components";
import { useState } from "react";

const InventoryInfoForm: React.FC = () => {
  const {
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<Product>();

  const [messageApi, contextHolder] = message.useMessage();

  const [warehouseEntries, setWarehouseEntries] = useState<
    Array<{ key: string; data: WarehouseStock }>
  >([]);

  const [warehouseSelected, setWarehouseSelected] = useState<string | null>();
  const [activeStockByWarehouse, setActiveStockByWarehouse] =
    useState<boolean>(false);

  const handleAddWarehouse = () => {
    // Valido que se haya seleccionado una bodega
    if (!warehouseSelected) {
      messageApi.warning("Please select a warehouse");
      return;
    }

    // Obtengo las bodegas actuales
    const currentStocks = watch("warehouseStocks") || {};

    // Valido que la bodega seleccionada no haya sido agregada antes
    if (currentStocks[warehouseSelected]) {
      messageApi.warning("This warehouse has already been added");
      return;
    }

    // Creo mi nuevo objeto de stock por bodega
    const newStock: WarehouseStock = {
      warehouseId: warehouseSelected,
      quantity: 0,
      updatedAt: new Date().toISOString(),
    };

    // Actualizo el stock con el nuevo registro
    const updatedStocks = {
      ...currentStocks,
      [warehouseSelected]: newStock,
    };

    // Seteo en el formulario
    setValue("warehouseStocks", updatedStocks);

    // Seteo en el estado local para listar las bodegas agregadas
    setWarehouseEntries([
      ...warehouseEntries,
      { key: warehouseSelected, data: newStock },
    ]);

    messageApi.success("Warehouse added");
    setWarehouseSelected(null);
  };

  const handleUpdateWarehouseQuantity = (
    warehouseId: string,
    quantity: any
  ) => {
    // Obtengo la info de los stocks registrados
    const currentStocks = watch("warehouseStocks") || {};

    // Creo un nuevo objeto con la cantidad actualizada
    const updatedStocks = {
      ...currentStocks,
      [warehouseId]: {
        ...currentStocks[warehouseId],
        quantity: Number(quantity.target.value),
        updatedAt: new Date().toISOString(),
      },
    };

    // Seteo la nueva data actualizada en el form
    setValue("warehouseStocks", updatedStocks);
  };

  const handleRemoveWarehouse = (warehouseId: string) => {
    const currentStocks = watch("warehouseStocks") || {};
    const { [warehouseId]: removed, ...remainingStocks } = currentStocks;

    setValue("warehouseStocks", remainingStocks);
    setWarehouseEntries(warehouseEntries.filter((e) => e.key !== warehouseId));

    message.success("Warehouse removed");
  };

  const getWarehouseData = (warehouseId: string) => {
    const warehouseName = warehouses.find(
      (warehouse: Warehouse) => warehouse.id === warehouseId
    );
    return warehouseName;
  };

  return (
    <div className="bg-white p-3">
      {contextHolder}
      <div className="space-y-6">
        {/* Campo de Cantidad */}
        <div>
          <Controller
            name="quantity"
            control={control}
            render={({ field }) => (
              <InputForm
                {...field}
                type="text"
                keyName="quantity"
                label="Quantity"
                placeholder="0"
                required
                errors={errors}
              />
            )}
          />
        </div>

        {/* Campos de Stock Mínimo y Máximo */}
        <div className="flex items-center gap-4">
          <Controller
            name="minStock"
            control={control}
            render={({ field }) => (
              <InputForm
                {...field}
                type="text"
                keyName="minStock"
                label="Min Stock"
                placeholder="0"
                errors={errors}
              />
            )}
          />

          <Controller
            name="maxStock"
            control={control}
            render={({ field }) => (
              <InputForm
                {...field}
                type="text"
                keyName="maxStock"
                label="Max Stock"
                placeholder="0"
                errors={errors}
              />
            )}
          />
        </div>

        {/* Activar o desactivar stock por bodega */}
        <div className="flex flex-col gap-3">
          <label htmlFor="stockType">Stock by Warehouse?</label>
          <Switch
            value={activeStockByWarehouse}
            onChange={() => setActiveStockByWarehouse(!activeStockByWarehouse)}
            className="w-fit"
            id="stockType"
            defaultChecked={false}
          />
        </div>

        {/* Si el stock por bodega está activo */}
        {activeStockByWarehouse && (
          <div>
            <Divider orientation="left">Warehouse Assignment</Divider>

            {/* Agregar Bodega */}
            {warehouses.length > 0 && (
              <div className="flex gap-2 mb-4">
                <Select
                  placeholder="Select a warehouse"
                  className="flex-1"
                  value={warehouseSelected}
                  onChange={(value: any) => setWarehouseSelected(value)}
                  options={warehouses.map((w) => ({
                    value: w.id,
                    label: w.name,
                  }))}
                />
                <Button
                  type="dashed"
                  icon={<Icon name="Plus" />}
                  disabled={warehouses.length === 0}
                  onClick={handleAddWarehouse}
                >
                  Add
                </Button>
              </div>
            )}

            {/* Lista de Bodegas */}
            <div className="space-y-3 mb-4">
              {warehouseEntries.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <p className="text-slate-500">No warehouses assigned</p>
                </div>
              ) : (
                warehouseEntries.map((entry) => {
                  const warehouse = getWarehouseData(entry.key);
                  return (
                    <div
                      key={entry.key}
                      className="flex items-center justify-between p-4 border border-(--color-border) rounded-lg"
                    >
                      <div>
                        <h5 className="font-medium text-(--color-foreground)">
                          {warehouse?.name}
                        </h5>
                        <small className="text-(--color-muted-foreground)">
                          Code: {warehouse?.code}
                        </small>
                      </div>

                      <div className="flex items-center gap-5 w-32">
                        <Input
                          key={entry.key}
                          type="number"
                          min="0"
                          placeholder="0"
                          onChange={(value: any) =>
                            handleUpdateWarehouseQuantity(
                              entry.data.warehouseId,
                              value
                            )
                          }
                        />

                        <div>
                          <Button
                            icon={<Icon name="Trash" size={16} />}
                            onClick={() =>
                              handleRemoveWarehouse(entry.data.warehouseId)
                            }
                            title="Remove warehouse"
                          />
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InventoryInfoForm;
