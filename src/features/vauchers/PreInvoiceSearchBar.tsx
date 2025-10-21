import { Button } from "antd";
import { Icon } from "../../components";

interface PreInvoiceSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewPreInvoice: () => void;
}

const PreInvoiceSearchBar: React.FC<PreInvoiceSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onNewPreInvoice,
}) => {
  return (
    <div className="bg-(--color-card) rounded-lg border border-(--color-border) card-shadow p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-muted-foreground)"
            />
            <input
              type="text"
              placeholder="Search by client or number..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e?.target?.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-(--color-background) border border-(--color-border) rounded-lg text-sm text-(--color-foreground) placeholder-(--color-muted-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth"
            />
            {searchTerm && (
              <button
                onClick={() => onSearchChange("")}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-(--color-muted-foreground) hover:text-(--color-foreground) transition-smooth"
              >
                <Icon name="X" size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Botones de acción */}
        <div className="flex items-center space-x-3">
          <Button
            icon={<Icon name="Plus" size={16} />}
            iconPosition="start"
            onClick={onNewPreInvoice}
          >
            New Pre-Invoice
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PreInvoiceSearchBar;
