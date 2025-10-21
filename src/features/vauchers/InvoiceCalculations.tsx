import { useState } from "react";
import { Icon } from "../../components";
import { Input, Select } from "antd";

interface InvoiceCalculationsProps {
  cartItems: any[];
  discount: number | any;
  onDiscountChange: (discount: number) => void;
  className?: string;
}

const InvoiceCalculations: React.FC<InvoiceCalculationsProps> = ({
  cartItems,
  discount,
  onDiscountChange,
  className = "",
}) => {
  const [discountType, setDiscountType] = useState("percentage"); // 'percentage' or 'fixed'
  const [ivaRate, setIvaRate] = useState(15); // Default Spanish IVA rate
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [payStatus, setPayStatus] = useState("PENDING");

  const ivaOptions = [
    { value: 0, label: "0% - Exento" },
    { value: 15, label: "15% - IVA" },
  ];

  const paymentsMethod = [
    { value: "01", label: "SIN UTILIZACION DEL SISTEMA FINANCIERO" },
    { value: "15", label: "COMPENSACION DE DEUDAS" },
    { value: "16", label: "TARJETA DE DEBITO" },
    { value: "17", label: "DINERO ELECTRONICO" },
    { value: "18", label: "TARJETA PREPAGO" },
    { value: "19", label: "TARJETA DE CREDITO" },
    { value: "20", label: "OTROS CON UTILIZACION DEL SISTEMA FINANCIERO" },
    { value: "21", label: "ENDOSO DE TITULOS" },
  ];

  const paymentStatusOptions = [
    { value: "PENDING", label: "PENDIENTE" },
    { value: "PAID", label: "PAGADO" },
    { value: "CANCELLED", label: "CANCELADO" },
  ];

  const discountTypeOptions = [
    { value: "percentage", label: "Porcentaje (%)" },
    { value: "fixed", label: "Cantidad fija ($)" },
  ];

  // Calculate subtotal
  const subtotal = cartItems?.reduce(
    (total, item) => total + item?.lineTotal,
    0
  );

  // Calculate discount amount
  const getDiscountAmount = () => {
    if (!discount || discount <= 0) return 0;

    if (discountType === "percentage") {
      return (subtotal * discount) / 100;
    } else {
      return Math.min(discount, subtotal); // Don't allow discount greater than subtotal
    }
  };

  const discountAmount = getDiscountAmount();
  const subtotalAfterDiscount = subtotal - discountAmount;
  const ivaAmount = (subtotalAfterDiscount * ivaRate) / 100;
  const total = subtotalAfterDiscount + ivaAmount;

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;

    if (discountType === "percentage" && numValue > 100) {
      onDiscountChange(100);
    } else if (discountType === "fixed" && numValue > subtotal) {
      onDiscountChange(subtotal);
    } else {
      onDiscountChange(numValue);
    }
  };

  return (
    <div
      className={`bg-(--color-card) border border-border rounded-lg ${className}`}
    >
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-2">
          <Icon
            name="Calculator"
            size={20}
            className="text-(--color-primary)"
          />
          <h3 className="text-lg font-semibold text-foreground">
            Billing Calculations
          </h3>
        </div>
      </div>
      <div className="p-4 space-y-6">
        {/* Subtotal */}
        <div className="flex items-center justify-between py-2">
          <span className="text-foreground">Subtotal:</span>
          <span className="text-lg font-medium text-foreground">
            ${subtotal?.toFixed(2)}
          </span>
        </div>

        {/* Discount Configuration */}
        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground">Discount</h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label htmlFor="discountType">Discount Type</label>
            <Select
              id="discountType"
              options={discountTypeOptions}
              value={discountType}
              onChange={setDiscountType}
            />

            <label htmlFor="discountValue">{`Discount ${
              discountType === "percentage" ? "(%)" : "($)"
            }`}</label>
            <Input
              id="discountValue"
              type="number"
              min="0"
              max={discountType === "percentage" ? 100 : subtotal}
              step={discountType === "percentage" ? 0.1 : 0.01}
              value={discount || ""}
              onChange={(e) => handleDiscountChange(e?.target?.value)}
              placeholder="0"
            />
          </div>

          {discountAmount > 0 && (
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Applied discount:</span>
              <span className="text-destructive font-medium">
                -${discountAmount?.toFixed(2)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-foreground">Subtotal after discount:</span>
            <span className="font-medium text-foreground">
              ${subtotalAfterDiscount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* IVA Configuration */}
        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground">Taxes</h4>

          <div className="flex flex-col gap-y-2">
            <label htmlFor="ivaRate">VAT Rate</label>
            <Select
              id="ivaRate"
              options={ivaOptions}
              value={ivaRate}
              onChange={setIvaRate}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">VAT ({ivaRate}%):</span>
            <span className="font-medium text-foreground">
              ${ivaAmount?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Detalles de pago */}
        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground">
            Payment Details
          </h4>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="payMethod">Payment Method</label>
            <Select
              id="payMethod"
              options={paymentsMethod}
              value={paymentMethod}
              onChange={setPaymentMethod}
              placeholder="Select a method"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="payStatus">Payment Status</label>
            <Select
              id="payStatus"
              options={paymentStatusOptions}
              value={payStatus}
              onChange={setPayStatus}
              placeholder="Select a method"
            />
          </div>
        </div>

        {/* Total */}
        <div className="border-t border-border pt-4">
          <div className="flex items-center justify-between py-3 bg-primary/5 rounded-lg px-4">
            <span className="text-lg font-semibold text-foreground">
              Total:
            </span>
            <span className="text-2xl font-bold text-primary">
              ${total?.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {cartItems?.length}
            </div>
            <div className="text-sm text-muted-foreground">Unique Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {cartItems?.reduce((total, item) => total + item?.quantity, 0)}
            </div>
            <div className="text-sm text-muted-foreground">Total Units</div>
          </div>
        </div>

        {/* Calculation Breakdown */}
        {cartItems?.length > 0 && (
          <div className="bg-muted/50 rounded-lg p-4 space-y-2">
            <h5 className="text-sm font-medium text-foreground mb-3">
              Calculation Breakdown:
            </h5>
            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Taxable Base:</span>
                <span>${subtotal?.toFixed(2)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="text-destructive">
                    -${discountAmount?.toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Base after discount:
                </span>
                <span>${subtotalAfterDiscount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT ({ivaRate}%):</span>
                <span>${ivaAmount?.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-border pt-1">
                <span>Total to pay:</span>
                <span className="text-primary">${total?.toFixed(2)}</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCalculations;
