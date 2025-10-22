import { useEffect, useState, useMemo } from "react";
import { Icon } from "../../components";
import { Input, Select } from "antd";
import useVoucherGeneratorStore from "../../store/VoucherGeneratorStore";
import type {
  DiscountType,
  PaymentMethod,
  PaymentMethodCode,
  PaymentStatus,
} from "../../types/business.types";
import {
  discountTypes,
  mockPaymentsMethod,
  mockPayStatus,
  taxesTypes,
} from "../../utils/testData";

interface InvoiceCalculationsProps {
  cartItems: any[];
  discount: number | any;
  onDiscountChange: (discount: number) => void;
  onIVAChange: (iva: number) => void;
  onPaymentMethodChange: (value: PaymentMethodCode) => void;
  className?: string;
}

const InvoiceCalculations: React.FC<InvoiceCalculationsProps> = ({
  cartItems,
  discount,
  onDiscountChange,
  onIVAChange,
  onPaymentMethodChange,
  className = "",
}) => {
  const [discountType, setDiscountType] = useState<DiscountType>("percentage");
  const [ivaRate, setIvaRate] = useState(15);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodCode | null>(
    null
  );
  const [payStatus, setPayStatus] = useState<PaymentStatus>("PENDING");
  const { voucher, setVoucher, calculateTotals } = useVoucherGeneratorStore();

  useEffect(() => {
    setVoucher({
      ...voucher,
      discount: discount,
      discountType: discountType,
    });
    calculateTotals();
  }, [discount, discountType]);

  const paymentsMethod = mockPaymentsMethod.map(
    (paymentMethod: PaymentMethod) => {
      return { ...paymentMethod, value: paymentMethod.code };
    }
  );

  const paymentStatusOptions = mockPayStatus;
  const discountTypeOptions = discountTypes;
  const ivaOptions = taxesTypes;

  // Cálculos memoizados para evitar recalcular en cada render
  const calculations = useMemo(() => {
    // Subtotal: suma de todos los lineTotal
    const subtotal =
      cartItems?.reduce((total, item) => total + (item?.lineTotal || 0), 0) ||
      0;

    // Calcular descuento aplicado
    let discountAmount = 0;
    const discountValue = parseFloat(discount) || 0;

    if (discountValue > 0) {
      if (discountType === "percentage") {
        // Descuento porcentual: no puede exceder 100%
        const validPercentage = Math.min(Math.max(discountValue, 0), 100);
        discountAmount = (subtotal * validPercentage) / 100;
      } else {
        // Descuento fijo: no puede exceder el subtotal
        discountAmount = Math.min(Math.max(discountValue, 0), subtotal);
      }
    }

    // Subtotal después del descuento
    const subtotalAfterDiscount = subtotal - discountAmount;

    // Calcular IVA sobre el subtotal después del descuento
    const ivaAmount = (subtotalAfterDiscount * ivaRate) / 100;

    // Total final
    const total = subtotalAfterDiscount + ivaAmount;

    // Cantidades totales
    const uniqueProducts = cartItems?.length || 0;
    const totalUnits =
      cartItems?.reduce((total, item) => total + (item?.quantity || 0), 0) || 0;

    return {
      subtotal,
      discountAmount,
      subtotalAfterDiscount,
      ivaAmount,
      total,
      uniqueProducts,
      totalUnits,
    };
  }, [cartItems, discount, discountType, ivaRate]);

  const handleIvaRateChange = (value: number) => {
    onIVAChange(value);
    setIvaRate(value);
  };

  const handleDiscountChange = (value: string) => {
    const numValue = parseFloat(value) || 0;

    // Validar según el tipo de descuento
    if (discountType === "percentage") {
      const validValue = Math.min(Math.max(numValue, 0), 100);
      onDiscountChange(validValue);
    } else {
      const validValue = Math.min(Math.max(numValue, 0), calculations.subtotal);
      onDiscountChange(validValue);
    }
  };

  const handleDiscountTypeChange = (value: DiscountType) => {
    setDiscountType(value);
    // Resetear descuento al cambiar tipo para evitar valores inválidos
    onDiscountChange(0);
  };

  const handlePayMethodChange = (value: PaymentMethodCode) => {
    setPaymentMethod(value);
    setVoucher({ ...voucher, paymentMethod: value });
    onPaymentMethodChange(value);
  };

  const handlePayStatusChange = (value: PaymentStatus) => {
    setPayStatus(value);
    setVoucher({ ...voucher, paymentStatus: value });
  };

  // Función para formatear números con 2 decimales
  const formatCurrency = (value: number): string => {
    return value.toFixed(2);
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
            ${formatCurrency(calculations.subtotal)}
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
              onChange={handleDiscountTypeChange}
            />

            <label htmlFor="discountValue">{`Discount ${
              discountType === "percentage" ? "(%)" : "($)"
            }`}</label>
            <Input
              id="discountValue"
              type="number"
              min="0"
              max={discountType === "percentage" ? 100 : calculations.subtotal}
              step={discountType === "percentage" ? 0.1 : 0.01}
              value={discount || ""}
              onChange={(e) => handleDiscountChange(e?.target?.value)}
              placeholder="0"
            />
          </div>

          {calculations.discountAmount > 0 && (
            <div className="flex items-center justify-between py-2 text-sm">
              <span className="text-muted-foreground">Applied discount:</span>
              <span className="text-destructive font-medium">
                -${formatCurrency(calculations.discountAmount)}
              </span>
            </div>
          )}

          <div className="flex items-center justify-between py-2 border-t border-border">
            <span className="text-foreground">Subtotal after discount:</span>
            <span className="font-medium text-foreground">
              ${formatCurrency(calculations.subtotalAfterDiscount)}
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
              onChange={(value) => handleIvaRateChange(value)}
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <span className="text-muted-foreground">VAT ({ivaRate}%):</span>
            <span className="font-medium text-foreground">
              ${formatCurrency(calculations.ivaAmount)}
            </span>
          </div>
        </div>

        {/* Detalles de pago */}
        <div className="space-y-4 border-t border-border pt-4">
          <h4 className="text-sm font-medium text-foreground">
            Payment Details
          </h4>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="payMethod">*Payment Method</label>
            <Select
              id="payMethod"
              options={paymentsMethod}
              value={paymentMethod}
              onChange={handlePayMethodChange}
              placeholder="Select a method"
            />
          </div>
          <div className="flex flex-col gap-y-2">
            <label htmlFor="payStatus">Payment Status</label>
            <Select
              id="payStatus"
              options={paymentStatusOptions}
              value={payStatus}
              onChange={handlePayStatusChange}
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
              ${formatCurrency(calculations.total)}
            </span>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {calculations.uniqueProducts}
            </div>
            <div className="text-sm text-muted-foreground">Unique Products</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-primary">
              {calculations.totalUnits}
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
                <span>${formatCurrency(calculations.subtotal)}</span>
              </div>
              {calculations.discountAmount > 0 && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Discount:</span>
                  <span className="text-destructive">
                    -${formatCurrency(calculations.discountAmount)}
                  </span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">
                  Base after discount:
                </span>
                <span>
                  ${formatCurrency(calculations.subtotalAfterDiscount)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">VAT ({ivaRate}%):</span>
                <span>${formatCurrency(calculations.ivaAmount)}</span>
              </div>
              <div className="flex justify-between font-medium border-t border-border pt-1">
                <span>Total to pay:</span>
                <span className="text-primary">
                  ${formatCurrency(calculations.total)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceCalculations;
