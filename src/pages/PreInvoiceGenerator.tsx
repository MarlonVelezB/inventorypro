import { useMemo, useRef, useState } from "react";
import { HeaderSection, InfoCard, ModalConfirmation } from "../components";
import type { InfoCardProps } from "../components/InfoCard";
import {
  ClientSelector,
  InvoiceCalculations,
  ProductSearch,
  ShoppingCart,
  WarehouseSelector,
} from "../features/vauchers";
import type { Product } from "../types/business.types";
import { getPrice, getStockInWarehouseSelected } from "../utils/utils";
import useModalStore from "../store/ModalStore";

const PreInvoiceGenerator = () => {
  const [selectedClient, setSelectedClient] = useState(false);
  const [selectedWarehouse, setSelectedWarehouse] = useState<string | null>(
    null
  );
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [discount, setDiscount] = useState(0);
  const prevWarehouseRef = useRef<string | null>(null);
  const { openModal } = useModalStore();

  const cartStats = useMemo(() => {
    const productsCount = cartItems.length;
    const subtotal = cartItems.reduce(
      (sum, item) => sum + (item.lineTotal || 0),
      0
    );
    const discountAmount = subtotal * (discount / 100);
    const total = subtotal - discountAmount;

    return {
      productsCount,
      subtotal,
      discountAmount,
      total,
    };
  }, [cartItems, discount]);

  const infoCards: InfoCardProps[] = [
    {
      key: "cardCustomer",
      titleCard: "Customer",
      cardInfo: selectedClient ? "Selected" : "Not selected",
      showIcon: true,
      iconName: "User",
      iconColor: "primary",
    },
    {
      key: "cardWarehouse",
      titleCard: "Warehouse",
      cardInfo: selectedWarehouse ? "Selected" : "Not selected",
      showIcon: true,
      iconName: "Warehouse",
      iconColor: "secondary",
    },
    {
      key: "cardProduct",
      titleCard: "Product",
      cardInfo: cartStats.productsCount,
      showIcon: true,
      iconName: "Box",
      iconColor: "accent",
    },
    {
      key: "cardTotal",
      titleCard: "Total",
      cardInfo: `$${cartStats.total.toFixed(2)}`,
      showIcon: true,
      iconName: "DollarSign",
      iconColor: "success",
    },
  ];

  const handleClientSelect = (client: any) => {
    setSelectedClient(client);
  };

  const handleWarehouseSelect = (warehouseValue: any) => {
    setSelectedWarehouse(warehouseValue);
    // Clear cart when warehouse changes to avoid inventory conflicts
    if (cartItems?.length > 0) {
         prevWarehouseRef.current = selectedWarehouse;
        openModal();
    }
  };


  const handleProductAdd = (product: Product) => {
    const existingItemIndex = cartItems?.findIndex(
      (item) => item?.id === product?.id
    );

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      const updatedItems = [...cartItems];
      const newQuantity =
        updatedItems?.[existingItemIndex]?.quantity + product?.quantity;

      const availableStock = getStockInWarehouseSelected(
        selectedWarehouse,
        product.warehouseStocks
      );
      const price = getPrice(updatedItems?.[existingItemIndex].prices);

      if (newQuantity > availableStock) {
        alert(
          `Stock insuficiente. Solo hay ${availableStock} unidades disponibles.`
        );
        return;
      }

      updatedItems[existingItemIndex] = {
        ...updatedItems?.[existingItemIndex],
        quantity: newQuantity,
        lineTotal: price * newQuantity,
      };
      setCartItems(updatedItems);
    } else {
      // Add new item
      setCartItems((prevItems) => [...prevItems, product]);
    }
  };

  const handleQuantityChange = (
    itemId: string | number,
    newQuantity: number
  ) => {
    setCartItems((prevItems) =>
      prevItems?.map((item) =>
        item?.id === itemId
          ? {
              ...item,
              quantity: newQuantity,
              lineTotal: item?.price * newQuantity,
            }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId: string | number) => {
    setCartItems((prevItems) =>
      prevItems?.filter((item) => item?.id !== itemId)
    );
  };

  const handleDiscountChange = (newDiscount: number | any) => {
    setDiscount(newDiscount);
  };

  return (
    <div className="space-y-6">
      <HeaderSection
        title="Pre-Invoice Generator"
        sectionDescription="Easily create pre-invoices with real-time inventory integration and smart validation."
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {infoCards.map((card: InfoCardProps) => (
          <div key={card.key}>
            <InfoCard
              key={card.key}
              titleCard={card.titleCard}
              cardInfo={card.cardInfo}
              showIcon={true}
              iconName={card.iconName}
              iconColor={card.iconColor}
            />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="space-y-6">
          <ClientSelector
            selectedClient={selectedClient}
            onClientSelect={handleClientSelect}
            className="bg-(--color-card) border border-border rounded-lg p-6"
          />

          <WarehouseSelector
            selectedWarehouse={selectedWarehouse}
            onWarehouseSelect={handleWarehouseSelect}
            className="bg-(--color-card) border border-border rounded-lg p-6"
          />
        </div>

        {/* Middle Column - Product Search and Cart */}
        <div className="space-y-6">
          <ProductSearch
            selectedWarehouse={selectedWarehouse}
            onProductAdd={handleProductAdd}
            className="bg-(--color-card) border border-border rounded-lg p-6"
          />

          <ShoppingCart
            cartItems={cartItems}
            onQuantityChange={handleQuantityChange}
            onRemoveItem={handleRemoveItem}
          />
        </div>

        {/* Right Column - Calculations */}
        <div>
          <InvoiceCalculations
            cartItems={cartItems}
            discount={discount}
            onDiscountChange={handleDiscountChange}
          />
        </div>
      </div>
      <ModalConfirmation
        title="Change Warehouse"
        message="Changing the warehouse will clear all items from your cart. Do you want to continue?"
        type="warning"
        acceptText="Yes, change"
        cancelText="Cancel"
        onAccept={() => setCartItems([])}
        onCancel={() => {setSelectedWarehouse(prevWarehouseRef.current)}}
      />
    </div>
  );
};

export default PreInvoiceGenerator;
