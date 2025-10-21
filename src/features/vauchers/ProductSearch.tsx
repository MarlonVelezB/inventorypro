import { useState, useRef, useEffect } from "react";
import { productsForUI } from "../../utils/testData";
import type { Price, Product } from "../../types/business.types";
import { Icon } from "../../components";
import { Alert, Button, Input } from "antd";
import { getPrice, getStockInWarehouseSelected } from "../../utils/utils";

interface ProductSearchProps {
  selectedWarehouse: string | null;
  onProductAdd: (product: Product) => void;
  className: string;
}

const ProductSearch: React.FC<ProductSearchProps> = ({
  selectedWarehouse,
  onProductAdd,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mockProducts, _] = useState(productsForUI);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event?.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (searchTerm?.trim()) {
      const filtered = mockProducts?.filter(
        (product) =>
          product?.name?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.sku?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.description
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(mockProducts);
    }
  }, [searchTerm]);

  const handleSearchChange = (e: any) => {
    setSearchTerm(e?.target?.value);
    setIsDropdownOpen(true);
    setSelectedProduct(null);
  };

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setSearchTerm(product?.name);
    setIsDropdownOpen(false);
    setQuantity(1);
  };

  const handleAddProduct = () => {
    if (!selectedProduct || !selectedWarehouse) return;

    //const availableStock = ?.[selectedWarehouse] || 0;
    const availableStock = getStockInWarehouseSelected(
      selectedWarehouse,
      selectedProduct?.warehouseStocks
    );

    if (quantity > availableStock) {
      alert(
        `Stock insuficiente. Solo hay ${availableStock} unidades disponibles.`
      );
      return;
    }

    const price = selectedProduct.prices.find(
      (price: Price) => price.label === "Regular Price"
    );

    // Ensure amount is a number (fallback to 0) before calculating line total
    const unitAmount = price?.amount ?? 0;

    const productToAdd = {
      ...selectedProduct,
      quantity: quantity,
      availableStock,
      lineTotal: unitAmount * quantity,
    };

    onProductAdd(productToAdd);

    // Reset form
    setSelectedProduct(null);
    setSearchTerm("");
    setQuantity(1);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSearchTerm("");
    setQuantity(1);
    setIsDropdownOpen(false);
  };

  const getStockStatus = (stock: number) => {
    if (stock === 0)
      return {
        status: "Sin stock",
        color: "text-destructive",
        bg: "bg-destructive/10",
      };
    if (stock <= 5)
      return {
        status: "Stock bajo",
        color: "text-warning",
        bg: "bg-warning/10",
      };
    if (stock <= 15)
      return {
        status: "Stock medio",
        color: "text-accent",
        bg: "bg-accent/10",
      };
    return { status: "Stock alto", color: "text-success", bg: "bg-success/10" };
  };

  return (
    <div className={`space-y-4 ${className}`} ref={dropdownRef}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Icon name="Search" size={20} className="text-(--color-primary)" />
          <h3 className="text-lg font-semibold text-foreground">
            Product Search
          </h3>
        </div>
        {selectedProduct && (
          <button
            onClick={handleClearSelection}
            className="text-sm text-(--color-destructive) hover:text-destructive/80 transition-smooth"
          >
            Clear selection
          </button>
        )}
      </div>

      {!selectedWarehouse && (
        <Alert
          message="Select a warehouse first to search products"
          showIcon
          type="warning"
        />
      )}

      {selectedWarehouse && (
        <>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name, SKU, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              disabled={!selectedWarehouse}
              className="pr-10"
            />
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <Icon
                name="Search"
                size={16}
                className="text-(--color-muted-foreground)"
              />
            </div>
          </div>

          {/* Product Selection Dropdown */}
          {isDropdownOpen && selectedWarehouse && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-(--color-border) rounded-lg dropdown-shadow z-50 max-h-80 overflow-y-auto">
              {filteredProducts?.length === 0 ? (
                <div className="p-4 text-center text-muted-foreground">
                  <Icon name="Package" size={24} className="mx-auto mb-2" />
                  <p>No products found</p>
                </div>
              ) : (
                <div className="py-2">
                  {filteredProducts?.map((product) => {
                    const stock = getStockInWarehouseSelected(
                      selectedWarehouse,
                      product?.warehouseStocks
                    );
                    const stockInfo = getStockStatus(stock);

                    return (
                      <button
                        key={product?.id}
                        onClick={() => handleProductSelect(product)}
                        disabled={stock === 0}
                        className={`w-full px-4 py-3 text-left hover:bg-(--color-muted) transition-smooth border-b border-(--color-border) last:border-b-0 ${
                          stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden">
                            <img
                              src={
                                product?.images?.[0]?.url ??
                                "/assets/images/no_image.png"
                              }
                              alt={product?.name ?? "Product image"}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).src =
                                  "/assets/images/no_image.png";
                              }}
                            />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="font-medium text-(--color-foreground)">
                                {product?.name}
                              </span>
                              <span className="text-sm font-medium text-(--clor-primary)">
                                ${getPrice(product.prices)?.toFixed(2)}
                              </span>
                            </div>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-(--color-muted-foreground)">
                                SKU: {product?.sku}
                              </span>
                              <div
                                className={`text-xs px-2 py-0.5 rounded ${stockInfo?.bg} ${stockInfo?.color}`}
                              >
                                {stock} units
                              </div>
                            </div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Selected Product Details */}
          {selectedProduct && (
            <div className="bg-(--color-muted) border border-(--color-border) rounded-lg p-4 space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-(--color-muted) rounded-lg overflow-hidden">
                  <img
                    src={
                      selectedProduct?.images?.[0]?.url ??
                      "/assets/images/no_image.png"
                    }
                    alt={selectedProduct?.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "/assets/images/no_image.png";
                    }}
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-(--color-foreground)">
                      {selectedProduct?.name}
                    </h4>
                    <span className="text-lg font-semibold text-(--color-primary)">
                      ${getPrice(selectedProduct.prices)?.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-(--color-muted-foreground)">
                    {selectedProduct?.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-(--color-muted-foreground)">
                      SKU: {selectedProduct?.sku}
                    </span>
                    <div className="flex items-center space-x-2">
                      <Icon
                        name="Package"
                        size={14}
                        className="text-(--color-success)"
                      />
                      <span className="text-sm text-(--color-success)">
                        {getStockInWarehouseSelected(
                          selectedWarehouse,
                          selectedProduct.warehouseStocks
                        )}{" "}
                        available
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="flex-1">
                  <label htmlFor="quantity">Quantity</label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={getStockInWarehouseSelected(
                      selectedWarehouse,
                      selectedProduct.warehouseStocks
                    )}
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e?.target?.value))}
                    className="w-full"
                  />
                </div>
                <div className="pt-6">
                  <Button
                    onClick={handleAddProduct}
                    disabled={
                      !quantity ||
                      quantity <= 0 ||
                      quantity >
                        getStockInWarehouseSelected(
                          selectedWarehouse,
                          selectedProduct.warehouseStocks
                        )
                    }
                    icon={<Icon name="Plus" size={16} />}
                    iconPosition="start"
                  >
                    Add
                  </Button>
                </div>
              </div>

              <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Line Total:</span>
                  <span className="font-semibold text-primary">
                    €
                    {(
                      (getPrice(selectedProduct.prices) ?? 0) * quantity
                    ).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductSearch;
