import React, { useCallback, useState } from "react";
import {
  Upload,
  Button,
  Table,
  message,
  Space,
  Tag,
  Divider,
  Image,
} from "antd";
import * as XLSX from "xlsx";
import type {
  CustomAttribute,
  Price,
  Product,
  WarehouseStock,
} from "../../types/business.types";
import { Icon, LoadingScreen } from "../../components";
import { productsService } from "../../service/core/productService";
import { useConfirmStore } from "../../store/ConfirmStore";
import { useProductStore } from "../../store/ProductStore";
import { generateSimpleSKU } from "../../utils/utils";

const { Dragger } = Upload;

interface ExcelUploaderProps {
  finalyImport: () => void;
}

const ExcelUploader: React.FC<ExcelUploaderProps> = ({
  finalyImport,
}: ExcelUploaderProps) => {
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
  const MAX_ROWS = 5000; // Por ejemplo, 5000 filas como máximo
  const [fileList, setFileList] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const { showConfirm } = useConfirmStore();
  const { setProducts, products } = useProductStore();

  const handleFileChange = (info: any) => {
    setFileList(info.fileList.slice(-1));
  };

  const mapExcelDataToProducts = ({
    headers,
    rows,
  }: {
    headers: string[];
    rows: any[];
  }): Product[] => {
    const products: Product[] = [];

    const COL_MAP = {
      ID: headers.findIndex((h) => h === "ID_PRODUCTO"),
      NAME: headers.findIndex((h) => h === "NOMBRE"),
      DESC: headers.findIndex((h) => h === "DESCRIPCION"),
      COST: headers.findIndex((h) => h === "COSTO"),
      SKU: headers.findIndex((h) => h === "SKU"),
      MIN_STOCK: headers.findIndex((h) => h === "STOCK_MINIMO"),
      MAX_STOCK: headers.findIndex((h) => h === "STOCK_MAXIMO"),
      STATUS: headers.findIndex((h) => h === "ESTADO"),
      CURRENCY: headers.findIndex((h) => h === "MONEDA"),
      TOTAL_QTY: headers.findIndex((h) => h === "CANTIDAD_TOTAL"),
      MAIN_IMG: headers.findIndex((h) => h === "IMAGEN_PRINCIPAL_URL"),
      TAGS: headers.findIndex((h) => h === "ETIQUETAS"),
    };

    const STOCK_PREFIX = "STOCK_EN_BODEGA_";

    rows.forEach((row) => {
      const prices: Price[] = [];
      const PRICE_PREFIX = "PRECIO_";
      const currency = row[COL_MAP.CURRENCY];

      headers.forEach((header, index) => {
        if (header.toUpperCase().startsWith(PRICE_PREFIX)) {
          const label = header.substring(PRICE_PREFIX.length);
          const amount = parseFloat(row[index] || "0");

          if (label && amount > 0) {
            prices.push({
              label: label,
              amount: amount,
              currency: String(currency),
            });
          }
        }
      });

      const warehouseStocks: Record<string, WarehouseStock> = {};

      headers.forEach((header, index) => {
        const hUpper = header.toUpperCase();

        if (hUpper.startsWith(STOCK_PREFIX)) {
          const warehouseId = header.substring(STOCK_PREFIX.length);
          const quantity = parseInt(row[index] || "0", 10);

          if (quantity > 0) {
            warehouseStocks[warehouseId] = {
              warehouseId: warehouseId,
              quantity: quantity,
              updatedAt: new Date().toISOString(),
            };
          }
        }
      });

      const additionalFeatures: CustomAttribute[] = [];
      const FEATURE_PREFIX = "CARACT_";

      headers.forEach((header, index) => {
        if (header.toUpperCase().startsWith(FEATURE_PREFIX)) {
          const key = header.substring(FEATURE_PREFIX.length);
          const value = row[index];

          if (value) {
            additionalFeatures.push({
              key: key,
              value: String(value),
            });
          }
        }
      });

      const product: Product = {
        id: String(row[COL_MAP.ID] || ""),
        name: String(row[COL_MAP.NAME] || "Producto sin Nombre"),
        description: String(row[COL_MAP.DESC] || ""),
        cost: parseFloat(row[COL_MAP.COST] || "0"),
        sku: String(row[COL_MAP.SKU] || ""),
        quantity: parseInt(row[COL_MAP.TOTAL_QTY] || "0", 10),
        prices: prices,
        warehouseStocks: warehouseStocks,
        minStock: parseInt(row[COL_MAP.MIN_STOCK] || "0", 10) || 1,
        maxStock:
          parseInt(row[COL_MAP.MAX_STOCK] || "0", 10) ||
          parseInt(row[COL_MAP.TOTAL_QTY] || "0", 10),
        status: (row[COL_MAP.STATUS] as Product["status"]) || "ACTIVE",
        images: row[COL_MAP.MAIN_IMG]
          ? [{ url: String(row[COL_MAP.MAIN_IMG]), isPrimary: true }]
          : [],
        tags: row[COL_MAP.TAGS]
          ? String(row[COL_MAP.TAGS])
              .split(",")
              .map((tag) => ({ value: tag.trim() }))
          : [],
        additionalFeatures: additionalFeatures,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      
      const sku = String(row[COL_MAP.SKU])
        ? generateSimpleSKU(product)
        : String(row[COL_MAP.SKU]);

      products.push({ ...product, sku: sku });
    });
    return products;
  };

  const handleImport = () => {
    if (fileList.length === 0) {
      message.warning("Please select a file first");
      return;
    }

    setLoading(true);

    const file = fileList[0].originFileObj;
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const range = XLSX.utils.decode_range(worksheet["!ref"] || "A1:A1");
        if (range.e.r > MAX_ROWS) {
          range.e.r = MAX_ROWS; // Ajustar el límite de fila
          message.warning(
            `The sheet was truncated to the first ${MAX_ROWS} rows.`
          );
        }

        //@ts-ignore
        const limitedRange = XLSX.utils.encode_range(range);

        const jsonSheetData: any[] = XLSX.utils.sheet_to_json(worksheet, {
          header: 1,
          range: limitedRange, // Usar el rango limitado
        });

        const headers = jsonSheetData[0];
        const rows = jsonSheetData.slice(1);
        const importedProducts = mapExcelDataToProducts({ headers, rows });

        console.log("Productos Importados:", importedProducts);

        // const result = haveSameKeys(
        //   importedProducts[0],
        //   productsForUI[0]
        // );

        // console.log(result); // false

        setPreviewData(importedProducts);
        setLoading(false);
        message.success(
          `${importedProducts.length} products imported successfully!`
        );
      } catch (error) {
        console.error("Error importing file:", error);
        message.error("Error importing file. Please check the format.");
        setLoading(false);
      }
    };

    reader.onerror = () => {
      message.error("Error reading file");
      setLoading(false);
    };

    reader.readAsBinaryString(file);
  };

  const handleClearSelection = () => {
    setFileList([]);
    setPreviewData([]);
    message.info("Selection cleared");
  };

  const handleSaveImport = async () => {
    try {
      console.log("Saving products:", previewData);
      showConfirm(
        {
          title: "Are you sure?",
          message: "Do you want to save the imported items?",
          type: "info", // info | warning | success | danger
          confirmText: "Save",
          cancelText: "Cancel",
        },
        async () => {
          try {
            setLoading(true);
            const res = await productsService.createBatch(previewData);
            console.log("RES: ", res);
            setLoading(false);
            setProducts([...products, ...res.data]);
            handleClearSelection();
            finalyImport();
          } catch (error) {
            console.error("Error al eliminar el producto", error);
            setLoading(false);
          }
        }
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleCancel = () => {
    setPreviewData([]);
    message.info("Import cancelled");
  };

  const uploadProps = {
    beforeUpload: (file: any) => {
      // ⚠️ Importante: Devuelve false para que Antd no haga la subida automática
      if (file.size > MAX_FILE_SIZE) {
        message.error(
          `File size must be less than ${MAX_FILE_SIZE / 1024 / 1024}MB`
        );
        return Upload.LIST_IGNORE; // Ignorar el archivo en la lista
      }
      return false; // Permite el procesamiento manual
    },
    onChange: handleFileChange,
    fileList: fileList,
    accept: ".xlsx,.xls,.csv",
    maxCount: 1,
    onRemove: () => {
      setFileList([]);
    },
  };

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

  const columns = [
    {
      title: "Product",
      key: "product",
      width: 250,
      fixed: "left" as const,
      render: (_: any, record: Product) => (
        <div className="flex flex-col">
          <span className="font-semibold text-gray-800">{record.name}</span>
          <span className="text-xs text-gray-500">SKU: {record.sku}</span>
          <span className="text-xs text-gray-400">ID: {record.id}</span>
        </div>
      ),
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      width: 100,
      render: (cost: number) => (
        <span className="font-semibold text-gray-700">${cost.toFixed(2)}</span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "quantity",
      key: "quantity",
      width: 80,
      align: "center" as const,
      render: (qty: number) => (
        <Tag color={qty > 0 ? "blue" : "red"} className="font-semibold">
          {qty}
        </Tag>
      ),
    },
    {
      title: "Warehouse Stocks",
      key: "warehouseStocks",
      width: 200,
      render: (_: any, record: Product) => (
        <div className="flex flex-col gap-1">
          {record.warehouseStocks &&
          Object.keys(record.warehouseStocks).length > 0 ? (
            Object.entries(record.warehouseStocks).map(
              ([warehouseId, stock]) => (
                <div
                  key={warehouseId}
                  className="text-xs bg-amber-50 px-2 py-1 rounded flex items-center gap-1"
                >
                  <Icon name="Warehouse" size={12} className="text-amber-600" />
                  <span className="text-gray-600">{warehouseId}:</span>{" "}
                  <span className="font-semibold text-amber-700">
                    {stock.quantity}
                  </span>
                </div>
              )
            )
          ) : (
            <span className="text-xs text-gray-400">No warehouse stocks</span>
          )}
        </div>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 100,
      render: (status: string) => (
        <Tag color={status === "ACTIVE" ? "success" : "error"}>
          <div className="flex items-center gap-1">
            {status === "ACTIVE" && <Icon name="CheckCircle" size={12} />}
            {status}
          </div>
        </Tag>
      ),
    },
    {
      title: "Prices",
      key: "prices",
      width: 180,
      render: (_: any, record: Product) => (
        <div className="flex flex-col gap-1">
          {record.prices && record.prices.length > 0 ? (
            record.prices.map((price, idx) => (
              <div key={idx} className="text-xs bg-blue-50 px-2 py-1 rounded">
                <span className="text-gray-600">{price.label}:</span>{" "}
                <span className="font-semibold text-blue-700">
                  {price.currency} {price.amount}
                </span>
              </div>
            ))
          ) : (
            <span className="text-xs text-gray-400">No prices</span>
          )}
        </div>
      ),
    },
    ...(previewData &&
    previewData.some(
      (p) => p.additionalFeatures && p.additionalFeatures.length > 0
    )
      ? [
          {
            title: "Features",
            key: "additionalFeatures",
            width: 200,
            render: (_: any, record: Product) => (
              <div className="flex flex-col gap-1">
                {record.additionalFeatures &&
                record.additionalFeatures.length > 0
                  ? record.additionalFeatures.map((feature, idx) => (
                      <div
                        key={idx}
                        className="text-xs bg-purple-50 px-2 py-1 rounded flex items-center gap-1"
                      >
                        <Icon
                          name="Sparkles"
                          size={12}
                          className="text-purple-600"
                        />
                        <span className="text-gray-600">{feature.key}:</span>{" "}
                        <span className="font-semibold text-purple-700">
                          {feature.value}
                        </span>
                      </div>
                    ))
                  : null}
              </div>
            ),
          },
        ]
      : []),
    ...(previewData && previewData.some((p) => p.images && p.images.length > 0)
      ? [
          {
            title: "Images",
            key: "images",
            width: 150,
            render: (_: any, record: Product) => renderImage(record.images),
          },
        ]
      : []),
    {
      title: "Tags",
      key: "tags",
      width: 180,
      render: (_: any, record: Product) => (
        <div className="flex flex-wrap gap-1">
          {record.tags && record.tags.length > 0 ? (
            record.tags.map((tag, idx) => (
              <Tag key={idx} color="purple" className="text-xs m-0">
                {tag.value}
              </Tag>
            ))
          ) : (
            <span className="text-xs text-gray-400">No tags</span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="w-full">
      {loading && <LoadingScreen message="Saving Products..." />}
      {/* Upload Section */}
      {previewData.length === 0 ? (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-linear-to-r from-green-400 to-emerald-500 mb-4 shadow-lg">
              <Icon name="FileSpreadsheet" size={32} className="text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Import Products
            </h2>
            <p className="text-gray-500 text-sm">
              Upload your Excel file to import products
            </p>
          </div>

          <Dragger
            {...uploadProps}
            className="hover:border-blue-400 transition-all"
          >
            <p className="flex justify-center mb-4">
              <Icon name="Inbox" size={60} className="text-blue-500" />
            </p>
            <p className="ant-upload-text text-lg font-semibold text-gray-700">
              Click or drag file to this area
            </p>
            <p className="ant-upload-hint text-gray-500 px-8 mt-2">
              Support for Excel files (.xlsx, .xls) and CSV files. Select a
              single file to import.
            </p>
          </Dragger>

          {fileList.length > 0 && (
            <div className="bg-linear-to-r from-blue-50 to-indigo-50 rounded-lg p-5 border border-blue-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                    <Icon
                      name="FileSpreadsheet"
                      size={20}
                      className="text-white"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800">
                      {fileList[0].name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {(fileList[0].size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
              </div>

              <Divider className="my-4" />

              <div className="flex gap-3 justify-end">
                <Button
                  icon={<Icon name="Trash2" size={16} />}
                  onClick={handleClearSelection}
                  size="large"
                >
                  Clear
                </Button>
                <Button
                  type="primary"
                  icon={<Icon name="Upload" size={16} />}
                  onClick={handleImport}
                  loading={loading}
                  size="large"
                  className="bg-linear-to-r from-blue-500 to-blue-600 border-0"
                >
                  Import File
                </Button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Preview Section */
        <div className="space-y-4">
          {/* Header with Actions */}
          <div className="flex items-center justify-between pb-4 border-b">
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                Preview Import
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <Icon name="CheckCircle" size={16} className="text-green-500" />
                <span className="text-sm text-gray-600">
                  <strong className="text-green-600">
                    {previewData.length}
                  </strong>{" "}
                  products ready to import
                </span>
              </div>
            </div>
            <Space>
              <Button
                icon={<Icon name="X" size={16} />}
                onClick={handleCancel}
                size="large"
              >
                Cancel
              </Button>
              <Button
                disabled={previewData.length === 0}
                type="primary"
                icon={<Icon name="Save" size={16} />}
                onClick={handleSaveImport}
                size="large"
                className="bg-linear-to-r from-green-500 to-emerald-600 border-0"
              >
                Save Import
              </Button>
            </Space>
          </div>

          {/* Table */}
          <div className="overflow-hidden rounded-lg border border-gray-200">
            <Table
              columns={columns}
              dataSource={previewData.map((p, idx) => ({ ...p, key: idx }))}
              pagination={{
                pageSize: 8,
                showSizeChanger: false,
                showTotal: (total) => `${total} products`,
                className: "px-4",
              }}
              scroll={{ x: 900, y: 400 }}
              size="middle"
              className="custom-table"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default ExcelUploader;
