import { useState, useRef, useEffect, useCallback } from "react";
import type { Price, Product, VoucherItem, WarehouseStock } from "../../types/business.types";
import { Icon, RenderImage } from "../../components";
import { Alert, Button, Input, Spin } from "antd";
import { getPrice, getStockInWarehouseSelected } from "../../utils/utils";
import useVoucherGeneratorStore from "../../store/VoucherGeneratorStore";
import { productsService } from "../../service/core/productService";

interface ProductSearchProps {
  selectedWarehouse: string | null;
  onProductAdd: (product: VoucherItem, warehouseStocks: Record<string, WarehouseStock>) => void;
  className: string;
}

// Hook personalizado para debounce
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

const ProductSearch: React.FC<ProductSearchProps> = ({
  selectedWarehouse,
  onProductAdd,
  className = "",
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const { voucher, updateItems } = useVoucherGeneratorStore();
  
  // Cache de productos por warehouse
  const productsCache = useRef<Map<string, Product[]>>(new Map());
  
  // Debounce del término de búsqueda (300ms)
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Cerrar dropdown al hacer click fuera
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

  // Función para obtener productos de la API usando el servicio
  const fetchProducts = useCallback(async (warehouseCode: string) => {
    // Verificar si ya tenemos los productos en cache
    if (productsCache.current.has(warehouseCode)) {
      return productsCache.current.get(warehouseCode)!;
    }

    setIsLoading(true);
    setError(null);

    try {
      const products = await productsService.getByWarehouse(warehouseCode);
      
      // Filtrar productos que no tengan ID válido
      const validProducts = products.filter(
        (product: Product) => product?.id && product.id.trim() !== ""
      );

      // Advertir en consola si hay productos sin ID
      if (validProducts.length < products.length) {
        console.warn(
          `Se encontraron ${products.length - validProducts.length} productos sin ID válido y fueron filtrados`
        );
      }
      
      // Guardar en cache solo los productos válidos
      productsCache.current.set(warehouseCode, validProducts);
      
      return validProducts;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Error desconocido";
      // Solo mostramos el error en el componente si es 404
      if (errorMessage.includes("No se encontraron productos")) {
        setError(errorMessage);
      }
      return [];
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar productos iniciales cuando se selecciona un warehouse
  useEffect(() => {
    if (selectedWarehouse) {
      fetchProducts(selectedWarehouse).then((products) => {
        setFilteredProducts(products);
      });
    } else {
      setFilteredProducts([]);
      setSearchTerm("");
      setSelectedProduct(null);
    }
  }, [selectedWarehouse, fetchProducts]);

  // Filtrar productos cuando cambia el término de búsqueda (debounced)
  useEffect(() => {
    if (!selectedWarehouse) return;

    const filterProducts = async () => {
      const products = await fetchProducts(selectedWarehouse);

      if (debouncedSearchTerm?.trim()) {
        const searchLower = debouncedSearchTerm.toLowerCase();
        const filtered = products.filter(
          (product: Product) =>
            product?.name?.toLowerCase()?.includes(searchLower) ||
            product?.sku?.toLowerCase()?.includes(searchLower) ||
            product?.description?.toLowerCase()?.includes(searchLower)
        );
        setFilteredProducts(filtered);
      } else {
        // Mostrar todos si no hay búsqueda
        setFilteredProducts(products);
      }
    };

    filterProducts();
  }, [debouncedSearchTerm, selectedWarehouse, fetchProducts]);

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
    console.log('selectedProduct: ', selectedProduct);
    if (!selectedProduct || !selectedWarehouse) return;

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
      (price: Price) => price.label === "Regular"
    );

    const unitAmount = price?.amount ?? 0;

    const itemVoucher: VoucherItem = {
      id: selectedProduct.id,
      productCode: selectedProduct.sku ? selectedProduct.sku : '',
      name: selectedProduct.name,
      description: selectedProduct.description,
      image: selectedProduct.images && selectedProduct.images.length > 0 ? selectedProduct.images[0].url : "",
      quantity: quantity,
      unitPrice: unitAmount,
      availableStock: availableStock,
      lineTotal: unitAmount * quantity,
    };
    updateItems([...voucher.items, itemVoucher]);

    onProductAdd(itemVoucher, selectedProduct.warehouseStocks ?? {});

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
        color: "text-red-600",
        bg: "bg-red-100",
      };
    if (stock <= 5)
      return {
        status: "Stock bajo",
        color: "text-yellow-600",
        bg: "bg-yellow-100",
      };
    if (stock <= 15)
      return {
        status: "Stock medio",
        color: "text-blue-600",
        bg: "bg-blue-100",
      };
    return { 
      status: "Stock alto", 
      color: "text-green-600", 
      bg: "bg-green-100" 
    };
  };

  return (
    <div className={`space-y-4 ${className}`} ref={dropdownRef}>
      {/* Header y Search - Parte fija */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon name="Search" size={20} className="text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Product Search
            </h3>
          </div>
          {selectedProduct && (
            <button
              onClick={handleClearSelection}
              className="text-sm text-red-600 hover:text-red-700 transition-colors"
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

        {error && (
          <Alert
            message={error}
            showIcon
            type="error"
            closable
            onClose={() => setError(null)}
          />
        )}

        {selectedWarehouse && (
          <div className="relative">
            <Input
              type="text"
              placeholder="Search by name, SKU, or description..."
              value={searchTerm}
              onChange={handleSearchChange}
              onFocus={() => setIsDropdownOpen(true)}
              disabled={!selectedWarehouse || isLoading}
              className="pr-10"
              suffix={
                isLoading ? (
                  <Spin size="small" />
                ) : (
                  <Icon name="Search" size={16} className="text-gray-400" />
                )
              }
            />

            {/* Product Selection Dropdown */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                {isLoading ? (
                  <div className="p-8 text-center">
                    <Spin size="large" />
                    <p className="mt-4 text-gray-500">Cargando productos...</p>
                  </div>
                ) : filteredProducts?.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
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
                      
                      // Generar key único combinando id con sku como fallback
                      const uniqueKey = product?.id || `${product?.sku}-${Math.random()}`;

                      return (
                        <button
                          key={uniqueKey}
                          onClick={() => handleProductSelect(product)}
                          disabled={stock === 0}
                          className={`w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0 ${
                            stock === 0 ? "opacity-50 cursor-not-allowed" : ""
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                             <RenderImage images={product?.images}/>
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="font-medium text-gray-900 truncate">
                                  {product?.name}
                                </span>
                                <span className="text-sm font-medium text-blue-600 shrink-0">
                                  ${getPrice(product.prices)?.toFixed(2)}
                                </span>
                              </div>
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-xs text-gray-500 truncate">
                                  SKU: {product?.sku}
                                </span>
                                <div
                                  className={`text-xs px-2 py-0.5 rounded ${stockInfo?.bg} ${stockInfo?.color} shrink-0`}
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
          </div>
        )}
      </div>

      {/* Selected Product Details - Con scroll interno */}
      {selectedProduct && selectedWarehouse && (
        <div className="flex-1 mt-4 overflow-hidden">
          <div className="h-full overflow-y-auto bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-4">
            <div className="flex items-start space-x-4">
              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
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
              <div className="flex-1 space-y-2 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="font-medium text-gray-900">
                    {selectedProduct?.name}
                  </h4>
                  <span className="text-lg font-semibold text-blue-600 shrink-0">
                    ${getPrice(selectedProduct.prices)?.toFixed(2)}
                  </span>
                </div>
                <p className="text-sm text-gray-600">
                  {selectedProduct?.description}
                </p>
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-gray-500">
                    SKU: {selectedProduct?.sku}
                  </span>
                  <div className="flex items-center space-x-2 shrink-0">
                    <Icon
                      name="Package"
                      size={14}
                      className="text-green-600"
                    />
                    <span className="text-sm text-green-600">
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
                <label htmlFor="quantity" className="block text-sm font-medium text-gray-700 mb-1">
                  Quantity
                </label>
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
                  type="primary"
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
                >
                  Add
                </Button>
              </div>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Line Total:</span>
                <span className="font-semibold text-blue-600">
                  $
                  {(
                    (getPrice(selectedProduct.prices) ?? 0) * quantity
                  ).toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;