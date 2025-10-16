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
      messageApi.warning("Selecciona una bodega");
      return;
    }

    // Obtengo las bodegas actuales
    const currentStocks = watch("warehouseStocks") || {};

    // Valido que la bodeha seleccionado no haya sigo seleccionada antes
    if (currentStocks[warehouseSelected]) {
      messageApi.warning("Esta bodega ya está agregada");
      return;
    }

    // Creo mi obj nuevo stock por bodega
    const newStock: WarehouseStock = {
      warehouseId: warehouseSelected,
      quantity: 0,
      updatedAt: new Date().toISOString(),
    };

    // Actualizo mi stock por bodega actual con el nuevo registro
    const updatedStocks = {
      ...currentStocks,
      [warehouseSelected]: newStock,
    };

    // Seteo en el control de form para capturar el cambio
    setValue("warehouseStocks", updatedStocks);

    // Seteo en mi estado local para listar las bodegas agregadas
    setWarehouseEntries([
      ...warehouseEntries,
      { key: warehouseSelected, data: newStock },
    ]);

    messageApi.success("Bodega agregada");
    setWarehouseSelected(null);
  };

  const handleUpdateWarehouseQuantity = (
    warehouseId: string,
    quantity: any
  ) => {
    // Obtengo la info de los stoks ya registrados
    const currentStocks = watch("warehouseStocks") || {};
    // Creo un nuevo obj con el nuevo stock agregado
    const updatedStocks = {
      // spread para propagar los elementos existentes en el nuevo obj
      ...currentStocks,
      [warehouseId]: {
        // propago el elemento si llegara a existir ya en la estructura anterior
        ...currentStocks[warehouseId],
        quantity: Number(quantity.target.value),
        updatedAt: new Date().toISOString(),
      },
    };

    console.log("updatedStocks: ", updatedStocks);
    // seteo la nueva data actualizado en el form
    setValue("warehouseStocks", updatedStocks);
  };

  const handleRemoveWarehouse = (warehouseId: string) => {
    const currentStocks = watch("warehouseStocks") || {};
    const { [warehouseId]: removed, ...remainingStocks } = currentStocks;

    setValue("warehouseStocks", remainingStocks);
    setWarehouseEntries(warehouseEntries.filter((e) => e.key !== warehouseId));

    message.success("Bodega eliminada");
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

        {/* Campo de Cantidad */}
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

        <div className="flex flex-col gap-3">
          <label htmlFor="stockType">Stock por Bodega?</label>
          <Switch
            value={activeStockByWarehouse}
            onChange={() => setActiveStockByWarehouse(!activeStockByWarehouse)}
            className="w-fit"
            id="stockType"
            defaultChecked={false}
          />
        </div>

        {activeStockByWarehouse && (
          <div>
            <Divider orientation="left">Asignación por Almacén</Divider>
            {/* Agregar Bodega */}
            {warehouses.length > 0 && (
              <div className="flex gap-2 mb-4">
                <Select
                  placeholder="Selecciona una bodega"
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
                  Agregar
                </Button>
              </div>
            )}

            {/* Lista de Bodegas */}
            <div className="space-y-3 mb-4">
              {warehouseEntries.length === 0 ? (
                <div className="text-center py-8 border-2 border-dashed border-slate-300 rounded-lg bg-slate-50">
                  <p className="text-slate-500">No hay bodegas asignadas</p>
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
                          Código: {warehouse?.code}
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
