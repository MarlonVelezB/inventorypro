import { Space, Table, Image, type TableProps, Button, Tooltip } from "antd";
import { useMemo, useCallback } from "react";
import type { Product } from "../../types/business.types";
import { productsForUI } from "../../utils/testData";
import { Icon } from "../../components";

interface StockStatus {
  text: string;
  color: "success" | "warning" | "destructive" | "foreground";
}

const ProductTable = () => {
  const getColorClass = useCallback((color: StockStatus["color"]) => {
    const colorMap = {
      success: "text-green-600",
      warning: "text-orange-500",
      destructive: "text-red-600",
      foreground: "text-gray-900",
    };
    return colorMap[color];
  }, []);

  const getStockStatus = useCallback(
    (quantity: number, minStock: number, maxStock: number): StockStatus => {
      if (quantity === 0) {
        return { text: "Out of Stock", color: "destructive" };
      }
      if (quantity <= minStock) {
        return { text: "Low Stock", color: "warning" };
      }
      if (quantity >= maxStock) {
        return { text: "Overstocked", color: "warning" };
      }
      return { text: "In Stock", color: "success" };
    },
    []
  );

  const renderStockStatus = useCallback(
    (quantity: number, minStock: number, maxStock: number) => {
      const status = getStockStatus(quantity, minStock, maxStock);

      return (
        <div>
          <p className="text-sm font-medium text-gray-900">{quantity}</p>
          <p className={`text-sm font-medium ${getColorClass(status.color)}`}>
            {status.text}
          </p>
        </div>
      );
    },
    [getStockStatus, getColorClass]
  );

  const renderWarehouseStock = useCallback((record: Product) => {
    if (!record.warehouseStocks) return null;

    return (
      <div>
        {Object.entries(record.warehouseStocks).map(([warehouseId, stock]) => (
          <div key={`${record.id}-${warehouseId}`} className="mb-2">
            <p className="text-sm font-medium text-gray-900">
              {stock.warehouseId}: {stock.quantity}
            </p>
          </div>
        ))}
      </div>
    );
  }, []);

  const renderPriceAndCost = useCallback((record: Product) => {
    return (
      <div>
        <p className="text-sm font-medium text-gray-900">
          Cost: ${record.cost.toFixed(2)}
        </p>
        {record.prices.map((price, index) => (
          <p
            key={`${record.id}-price-${price.id}-${index}`}
            className="text-sm text-gray-600"
          >
            {price.label}: {price.amount} {price.currency}
          </p>
        ))}
      </div>
    );
  }, []);

  const renderImage = useCallback((images: Product["images"]) => {
    if (!images?.length) {
      return (
        <div className="w-20 h-20 bg-gray-200 flex items-center justify-center rounded">
          <span className="text-gray-500 text-xs">No Image</span>
        </div>
      );
    }

    const primaryImage = images.find((img) => img.isPrimary) || images[0];

    return (
      <Image.PreviewGroup
        items={images.map((img) => ({
          src: img.url,
          alt: img.alt || "Product Image",
        }))}
      >
        <Image
          width={80}
          src={primaryImage.url}
          alt={primaryImage.alt || "Product"}
          fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
        />
      </Image.PreviewGroup>
    );
  }, []);

  const handleEdit = useCallback((record: Product) => {
    console.log("Edit product:", record.id);
    // Implementar lógica de edición
  }, []);

  const handleTransfer = useCallback((record: Product) => {
    console.log("Transfer stock:", record.id);
    // Implementar lógica de transferencia
  }, []);

  const handleDelete = useCallback((record: Product) => {
    console.log("Delete product:", record.id);
    // Implementar lógica de eliminación
  }, []);

  const columns: TableProps<Product>["columns"] = useMemo(
    () => [
      {
        title: "Image",
        dataIndex: "images",
        key: "image",
        width: 100,
        render: renderImage,
      },
      {
        title: "SKU",
        dataIndex: "sku",
        key: "sku",
        width: 120,
      },
      {
        title: "Product",
        key: "product",
        width: 250,
        render: (_, record) => (
          <div>
            <p className="text-sm font-medium text-gray-900">{record.name}</p>
            <p className="text-xs text-gray-600 line-clamp-2">
              {record.description}
            </p>
          </div>
        ),
      },
      {
        title: "Total Stock",
        key: "totalStock",
        width: 120,
        render: (_, record) =>
          renderStockStatus(
            record.quantity,
            record.minStock || 0,
            record.maxStock || Infinity
          ),
      },
      {
        title: "Warehouse Stock",
        key: "warehouseStock",
        width: 150,
        render: (_, record) => renderWarehouseStock(record),
      },
      {
        title: "Prices",
        key: "prices",
        width: 180,
        render: (_, record) => renderPriceAndCost(record),
      },
      {
        title: "Actions",
        key: "actions",
        width: 150,
        fixed: "right",
        render: (_, record) => (
          <Space size="small">
            <Tooltip title="Edit product">
              <Button
                icon={<Icon name="Pencil" size={16} />}
                type="text"
                onClick={() => handleEdit(record)}
                aria-label="Edit product"
              />
            </Tooltip>
            <Tooltip title="Transfer stock">
              <Button
                icon={<Icon name="ArrowLeftRight" size={16} />}
                type="text"
                onClick={() => handleTransfer(record)}
                aria-label="Transfer stock"
              />
            </Tooltip>
            <Tooltip title="Delete product">
              <Button
                icon={<Icon name="Trash" size={16} />}
                type="text"
                danger
                onClick={() => handleDelete(record)}
                aria-label="Delete product"
              />
            </Tooltip>
          </Space>
        ),
      },
    ],
    [
      renderImage,
      renderStockStatus,
      renderWarehouseStock,
      renderPriceAndCost,
      handleEdit,
      handleTransfer,
      handleDelete,
    ]
  );

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <Table<Product>
        columns={columns}
        dataSource={productsForUI}
        rowKey="id"
        scroll={{ x: 1200 }}
        pagination={{
          defaultPageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} products`,
        }}
      />
    </div>
  );
};

export default ProductTable;
