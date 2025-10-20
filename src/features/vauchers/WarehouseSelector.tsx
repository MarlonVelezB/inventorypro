import { Alert, Select } from "antd";
import { Icon } from "../../components";

interface WarehouseSelector {
  selectedWarehouse: any;
  onWarehouseSelect: (warehouse: any) => void;
  className: string;
}

const WarehouseSelector: React.FC<WarehouseSelector> = ({
  selectedWarehouse,
  onWarehouseSelect,
  className = "",
}) => {
  const mockWarehouses = [
    {
      value: "WH001",
      label: "Almacén Central Madrid",
      description: "Calle Industria 45, Madrid - 1,250 productos",
      address: "Calle Industria 45, Madrid",
      totalProducts: 1250,
      code: "WH001",
    },
    {
      value: "WH002",
      label: "Almacén Barcelona Norte",
      description: "Polígono Industrial Can Roca, Barcelona - 890 productos",
      address: "Polígono Industrial Can Roca, Barcelona",
      totalProducts: 890,
      code: "WH002",
    },
    {
      value: "WH003",
      label: "Almacén Valencia Sur",
      description: "Zona Franca Valencia, Valencia - 650 productos",
      address: "Zona Franca Valencia, Valencia",
      totalProducts: 650,
      code: "WH003",
    },
    {
      value: "WH004",
      label: "Almacén Sevilla",
      description: "Parque Empresarial Sevilla Este - 420 productos",
      address: "Parque Empresarial Sevilla Este",
      totalProducts: 420,
      code: "WH004",
    },
  ];

  const selectedWarehouseData = mockWarehouses?.find(
    (wh) => wh?.value === selectedWarehouse
  );

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="flex items-center space-x-2">
        <Icon name="Warehouse" size={20} className="text-(--color-primary)" />
        <h3 className="text-lg font-semibold text-(--color-foreground)">
          Selección de Almacén
        </h3>
      </div>

      <div className="flex flex-col gap-y-4">
        <label>*Almacén de origen</label>
        <Select
          placeholder="Seleccionar almacén..."
          options={mockWarehouses}
          value={selectedWarehouse}
          onChange={onWarehouseSelect}
          showSearch
          filterOption={(input, option) =>
            (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
          }
        />
        <p>Selecciona el almacén desde donde se tomarán los productos</p>
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
                  {selectedWarehouseData?.label}
                </h4>
                <span className="text-xs text-(--color-success) px-2 py-1 rounded">
                  {selectedWarehouseData?.code}
                </span>
              </div>
              <div className="space-y-1 text-sm text-(--color-muted-foreground)">
                <div className="flex items-center space-x-2">
                  <Icon name="MapPin" size={14} />
                  <span>{selectedWarehouseData?.address}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Package" size={14} />
                  <span>
                    {selectedWarehouseData?.totalProducts?.toLocaleString(
                      "es-ES"
                    )}{" "}
                    productos disponibles
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {!selectedWarehouse && (
        <Alert
          message="Selecciona un almacén para ver el inventario disponible"
          type="warning"
          showIcon
        />
      )}
    </div>
  );
};

export default WarehouseSelector;
