import { Button, Input } from "antd";
import { Icon } from "../../components";
import "./styles.css";
import useModalStore from "../../store/ModalStore";

const ProductHeaderPanel = () => {
  const {openModal} = useModalStore();
  return (
    <div className="bg-(--color-card) rounded-lg border border-border p-6 card-shadow">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Input
              size="large"
              placeholder="Search by SKU or product name"
              prefix={<Icon className="text-(--color-border)" name="Search" />}
            />
            <div className="mt-2 text-sm text-(muted-foreground)">
              <span>Total products: 5</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Quick Filters */}
          <div className="hidden md:flex items-center space-x-2">
            <Button type="text" icon={<Icon name="Filter" size={14} />}>
              Filters
            </Button>
            <Button type="text" icon={<Icon name="Download" size={14} />}>
              Export
            </Button>
            <Button type="text" icon={<Icon name="Upload" size={14} />}>
              Import
            </Button>
            <Button
              type="primary"
              icon={<Icon name="Plus" />}
              iconPosition="end"
              onClick={openModal}
            >
              Add a Product
            </Button>
          </div>
        </div>
      </div>
      {/* Quick Stats */}
      <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <p className="text-2xl font-bold text-foreground">5</p>
          <p className="text-xs text-(--color-muted-foreground)">
            Total Productos
          </p>
        </div>
        <div className="text-center p-3 bg-success/10 rounded-lg">
          <p className="text-2xl font-bold text-(--color-success)">156</p>
          <p className="text-xs text-(--color-muted-foreground)">En Stock</p>
        </div>
        <div className="text-center p-3 bg-warning/10 rounded-lg">
          <p className="text-2xl font-bold text-(--color-warning)">23</p>
          <p className="text-xs text-(--color-muted-foreground)">Stock Bajo</p>
        </div>
        <div className="text-center p-3 bg-error/10 rounded-lg">
          <p className="text-2xl font-bold text-(--color-error)">8</p>
          <p className="text-xs text-(--color-muted-foreground)">Sin Stock</p>
        </div>
      </div>
    </div>
  );
};

export default ProductHeaderPanel;
