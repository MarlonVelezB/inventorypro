import type { Price, WarehouseStock } from "../types/business.types";

export const getStockInWarehouseSelected = (
  selectedWarehouse: string | any,
  productStock?: Record<string, WarehouseStock>
) => {
  return selectedWarehouse && productStock
    ? productStock[selectedWarehouse].quantity
    : 0;
};

export const getPrice = (productPrices?: Price[]) => {
  const price = productPrices?.find(
    (price: Price) => price.label === "Regular Price"
  );
  return price?.amount ? price?.amount : 0;
};
