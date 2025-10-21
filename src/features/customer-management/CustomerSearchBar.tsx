import { useState } from "react";
import { Icon } from "../../components";
import { Button } from "antd";

interface ClientSearchBarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onNewClient: () => void;
}

const CustomerSearchBar: React.FC<ClientSearchBarProps> = ({
  searchTerm,
  onSearchChange,
  onNewClient,
}) => {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: "all",
    dateRange: "all",
    warehouse: "all",
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      status: "all",
      dateRange: "all",
      warehouse: "all",
    });
    onSearchChange("");
  };

  const hasActiveFilters =
    searchTerm || Object.values(filters)?.some((value) => value !== "all");

  return (
    <div className="bg-(--color-card) rounded-lg border border-(--color-border) card-shadow p-6">
      {/* Main Search Row */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
        {/* Search Input */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Icon
              name="Search"
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-(--color-muted-foreground)"
            />
            <input
              type="text"
              placeholder="Buscar por nombre, DNI, código o email..."
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

        {/* Action Buttons */}
        <div className="flex items-center space-x-3">
          {/* Advanced Search Toggle */}
          <Button
            variant="outlined"
            icon={<Icon name="Filter" size={16} />}
            iconPosition="start"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className={
                
              isAdvancedOpen
                ? "bg-[var(--color-primary)]/10 border-[var(--color-primary)]/20 text-(--color-primary)"
                : ""
            }
          >
            Filtros
          </Button>

          {/* New Client Button */}
          <Button
            icon={<Icon name="Plus" size={16} />}
            iconPosition="start"
            onClick={onNewClient}
          >
            Nuevo Cliente
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      {isAdvancedOpen && (
        <div className="mt-6 pt-6 border-t border-(--color-border)">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium text-(--color-foreground) mb-2">
                Estado
              </label>
              <select
                value={filters?.status}
                onChange={(e) => handleFilterChange("status", e?.target?.value)}
                className="w-full px-3 py-2 bg-(--color-background) border border-(--color-border) rounded-lg text-sm text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth"
              >
                <option value="all">Todos los estados</option>
                <option value="active">Activos</option>
                <option value="inactive">Inactivos</option>
                <option value="pending">Pendientes</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium text-(--color-foreground) mb-2">
                Fecha de Registro
              </label>
              <select
                value={filters?.dateRange}
                onChange={(e) =>
                  handleFilterChange("dateRange", e?.target?.value)
                }
                className="w-full px-3 py-2 bg-(--color-background) border border-(--color-border) rounded-lg text-sm text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth"
              >
                <option value="all">Todas las fechas</option>
                <option value="today">Hoy</option>
                <option value="week">Esta semana</option>
                <option value="month">Este mes</option>
                <option value="quarter">Este trimestre</option>
                <option value="year">Este año</option>
              </select>
            </div>

            {/* Warehouse Filter */}
            <div>
              <label className="block text-sm font-medium text-(--color-foreground) mb-2">
                Almacén Preferido
              </label>
              <select
                value={filters?.warehouse}
                onChange={(e) =>
                  handleFilterChange("warehouse", e?.target?.value)
                }
                className="w-full px-3 py-2 bg-(--color-background) border border-(--color-border) rounded-lg text-sm text-(--color-foreground) focus:outline-none focus:ring-2 focus:ring-(--color-primary) focus:border-transparent transition-smooth"
              >
                <option value="all">Todos los almacenes</option>
                <option value="centro">Almacén Centro</option>
                <option value="norte">Almacén Norte</option>
                <option value="sur">Almacén Sur</option>
              </select>
            </div>
          </div>

          {/* Filter Actions */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center space-x-2">
              {hasActiveFilters && (
                <Button
                  variant="outlined"
                  icon={<Icon name="X" size={16} />}
                  iconPosition="start"
                  onClick={clearFilters}
                  className="text-(--color-muted-foreground) hover:text-(--color-foreground)"
                >
                  Limpiar Filtros
                </Button>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outlined"
                onClick={() => setIsAdvancedOpen(false)}
              >
                Cerrar
              </Button>
              <Button
                icon={<Icon name="Search" size={16} />}
                iconPosition="start"
                onClick={() => console.log("Apply filters:", filters)}
              >
                Aplicar Filtros
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="mt-4 pt-4 border-t border-(--color-border)">
          <div className="flex items-center space-x-2 flex-wrap">
            <span className="text-sm text-(--color-muted-foreground)">
              Filtros activos:
            </span>
            {searchTerm && (
                
              <span className="inline-flex items-center px-2 py-1 bg-[var(--color-primary)]/10 text-(--color-primary) text-xs rounded-full">
                Búsqueda: "{searchTerm}"
                <button
                  onClick={() => onSearchChange("")}
                  className="ml-1 hover:text-[var(--color-primary)]/80"
                >
                  <Icon name="X" size={12} />
                </button>
              </span>
            )}
            {Object.entries(filters)?.map(([key, value]) => {
              if (value === "all") return null;
              return (
                <span
                  key={key}
                  className="inline-flex items-center px-2 py-1 bg-[var(--color-secondary)]/10 text-(--color-secondary) text-xs rounded-full"
                >
                  {key}: {value}
                  <button
                    onClick={() => handleFilterChange(key, "all")}
                    className="ml-1 hover:text-[var(--color-secondary)]/80"
                  >
                    <Icon name="X" size={12} />
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerSearchBar;
