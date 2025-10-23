import { create } from "zustand";
import type { Voucher, VoucherItem } from "../types/business.types";
import { getVoucherNumberSRI } from "../utils/utils";

interface VoucherGeneratorState {
  voucher: Voucher;
  setVoucher: (voucher: Voucher | Partial<Voucher>) => void;
  updateVoucher: (updates: Partial<Voucher>) => void;
  updateItems: (items: VoucherItem[]) => void;
  calculateTotals: () => void;
  resetVoucher: (lastVoucher?: Voucher | null) => void;
}

const createInitialVoucher = (lastVoucher?: Voucher | null): Voucher => ({
  invoiceNumber: getVoucherNumberSRI(1, 1, lastVoucher),
  issueDate: new Date().toISOString().split('T')[0], // Solo fecha YYYY-MM-DD
  dueDate: "",
  customer: {
    id: 0,
    code: "",
    name: "",
    lastname: "",
    email: "",
    phone: "",
    dni: "",
    address: "",
    status: "pending",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  seller: {
    businessName: "Divad Closet",
    ruc: "000000000",
    address: "Dolores Caguango 1-34 y Av. Pumapungo",
    phone: "0998430425",
    email: "divadcloset@hotmail.com",
  },
  items: [],
  subtotalBeforeDiscount: 0,
  subtotalAffterDiscount: 0,
  taxRate: 0.15, // IVA 15% por defecto
  taxAmount: 0,
  discount: 0,
  discountType: "percentage",
  total: 0,
  paymentStatus: "PENDING",
  paymentMethod: "01",
  notes: "",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

const useVoucherGeneratorStore = create<VoucherGeneratorState>((set) => ({
  voucher: createInitialVoucher(),

  // Establecer un voucher completo o actualizar parcialmente
  setVoucher: (voucherData) =>
    set((state) => ({
      voucher:
        "invoiceNumber" in voucherData && voucherData.invoiceNumber
          ? (voucherData as Voucher)
          : { ...state.voucher, ...voucherData },
    })),

  // Actualizar propiedades específicas del voucher
  updateVoucher: (updates) =>
    set((state) => {
      const updatedVoucher = {
        ...state.voucher,
        ...updates,
        updatedAt: new Date().toISOString(),
      };

      // Si se actualizaron campos que afectan los cálculos, recalcular
      const fieldsAffectingCalculation = [
        'items',
        'discount',
        'discountType',
        'taxRate'
      ];
      
      const shouldRecalculate = Object.keys(updates).some(key =>
        fieldsAffectingCalculation.includes(key)
      );

      if (shouldRecalculate) {
        return { voucher: calculateVoucherTotals(updatedVoucher) };
      }

      return { voucher: updatedVoucher };
    }),

  // Actualizar items y recalcular totales automáticamente
  updateItems: (items) =>
    set((state) => {
      const updatedVoucher = {
        ...state.voucher,
        items,
        updatedAt: new Date().toISOString(),
      };

      return { voucher: calculateVoucherTotals(updatedVoucher) };
    }),

  // Recalcular totales basados en el estado actual del voucher
  calculateTotals: () =>
    set((state) => ({
      voucher: calculateVoucherTotals(state.voucher),
    })),

  // Resetear el voucher al estado inicial
  resetVoucher: (lastVoucher) =>
    set({
      voucher: createInitialVoucher(lastVoucher),
    }),
}));

/**
 * Función pura para calcular todos los totales del voucher
 * Sigue la estructura: subtotal → descuento → IVA → total
 */
function calculateVoucherTotals(voucher: Voucher): Voucher {
  const { items, discount = 0, discountType = "percentage", taxRate = 0 } = voucher;

  // 1. Calcular subtotal antes de descuento (suma de todos los lineTotal)
  const subtotalBeforeDiscount = items.reduce(
    (sum, item) => sum + (item.lineTotal || 0),
    0
  );

  // 2. Calcular monto del descuento
  let discountAmount = 0;
  const discountValue = parseFloat(String(discount)) || 0;

  if (discountValue > 0) {
    if (discountType === "percentage") {
      // Validar que el porcentaje no exceda 100%
      const validPercentage = Math.min(Math.max(discountValue, 0), 100);
      discountAmount = (subtotalBeforeDiscount * validPercentage) / 100;
    } else {
      // Descuento fijo: no puede exceder el subtotal
      discountAmount = Math.min(
        Math.max(discountValue, 0),
        subtotalBeforeDiscount
      );
    }
  }

  // 3. Calcular subtotal después del descuento
  const subtotalAffterDiscount = subtotalBeforeDiscount - discountAmount;

  // 4. Calcular IVA sobre el subtotal después del descuento
  const taxAmount = subtotalAffterDiscount * taxRate;

  // 5. Calcular total final
  const total = subtotalAffterDiscount + taxAmount;

  // 6. Retornar voucher con todos los totales actualizados
  return {
    ...voucher,
    subtotalBeforeDiscount: parseFloat(subtotalBeforeDiscount.toFixed(2)),
    subtotalAffterDiscount: parseFloat(subtotalAffterDiscount.toFixed(2)),
    taxAmount: parseFloat(taxAmount.toFixed(2)),
    total: parseFloat(total.toFixed(2)),
    updatedAt: new Date().toISOString(),
  };
}

export default useVoucherGeneratorStore;