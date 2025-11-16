import { Alert, Select } from "antd";
import { Icon } from "../../components";
import { useWarehouseStore } from "../../store/WarehouseStore";
import { useEffect, useMemo, useState } from "react";
import { warehousesService } from "../../service/core/warehouseService";
import type { Warehouse } from "../../types/business.types";

interface WarehouseSelectorProps {
  selectedWarehouse: string | null;
  onWarehouseSelect: (code: string) => void;
  className?: string;
}

const WarehouseSelector: React.FC<WarehouseSelectorProps> = ({
  selectedWarehouse,
  onWarehouseSelect,
  className = "",
}) => {
  const { warehouses, setWarehouses } = useWarehouseStore();
  const [selectOptions, setSelectOptions] = useState<
    { label: string; value: string }[]
  >([]);

  useEffect(() => {
    // API del navegador que te permite cancelar operaciones asíncronas
    // Lo usamos para poder abortar una peticio HTPP cuando se desponde el componente y asi evitar el doble render
    const controller = new AbortController(); // Disponible globalmente
    const loadWarehouses = async () => {
      try {
        // controller.signal "antena" que escucha si se canceló algo
        const res = await warehousesService.getAll(controller.signal);
        const warehouseParseSelect = res.map((w: Warehouse) => ({
          label: w.name,
          value: w.code,
        }));
        setSelectOptions(warehouseParseSelect);
        setWarehouses(res);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setWarehouses([]);
        }
      }
    };

    warehouses.length === 0 && loadWarehouses();

    return () => {
      controller.abort(); // Cancela cuando el componente se desmonta
    };
  }, []);

  const selectedWarehouseData = selectOptions?.find(
    (wh) => wh?.value === selectedWarehouse
  );

  const selectedWarehouseObject = useMemo(() => {
    // La dependencia es 'selectedWarehouse' (el código) y 'warehouses' (el array)
    // Solo buscamos el objeto completo cuando el código seleccionado o la lista de almacenes cambian.
    return warehouses.find((w: Warehouse) => w.code === selectedWarehouse);
  }, [selectedWarehouse, warehouses]); // Dependencias: Si alguna cambia, recalcula.

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon name="Warehouse" size={20} className="text-(--color-primary)" />
        <h3 className="text-lg font-semibold text-(--color-foreground)">
          Warehouse Selection
        </h3>
      </div>

      <div className="flex flex-col gap-y-4">
        <label>*Source Warehouse</label>
        <Select
          placeholder="Select warehouse..."
          options={selectOptions}
          value={selectedWarehouse}
          onChange={onWarehouseSelect}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
        <p>Select the warehouse from which the products will be taken</p>
      </div>

      {/* Selected Warehouse Info */}
      {selectedWarehouseData && (
        <div className="bg-(--color-muted) border border-border rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <div className="w-10 h-10 bg-(--color-primary) rounded-lg flex items-center justify-center">
              <Icon name="Warehouse" size={20} color="white" />
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-medium text-(--color-foreground)">
                  {selectedWarehouseObject?.name}
                </h4>
                <span className="text-xs text-(--color-success) px-2 py-1 rounded">
                  {selectedWarehouseObject?.code}
                </span>
              </div>
              <div className="space-y-1 text-sm text-(--color-muted-foreground)">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} />
                  <span>
                    {selectedWarehouseObject?.address}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!selectedWarehouse && (
        <Alert
          message="Select a warehouse to see available inventory"
          type="warning"
          showIcon
        />
      )}
    </div>
  );
};

export default WarehouseSelector;
