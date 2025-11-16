import type {
  PaymentMethod,
  Price,
  Product,
  Voucher,
  WarehouseStock,
} from "../types/business.types";
import { mockPaymentsMethod } from "./testData";

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
    (price: Price) => price.label === "Regular"
  );
  return price?.amount ? price?.amount : 0;
};

/**
 * Asegura que un número tenga una longitud específica rellenando con ceros a la izquierda.
 * @param num El número a formatear (o la cadena).
 * @param length La longitud total deseada de la cadena.
 * @returns La cadena formateada con ceros a la izquierda.
 */
export const padNumber = (num: number | string, length: number): string => {
  // Convertimos a string por si se pasa como número
  const numStr = String(num);

  // Usamos padStart para rellenar con '0' hasta la longitud deseada
  return numStr.padStart(length, "0");
};

/**
 * Genera el número de factura siguiente en el formato oficial del SRI de Ecuador: EEE-PPP-SSSSSSSSS
 * * @param codigoEstablecimiento El código del establecimiento (ej: 1).
 * @param puntoEmision El código del punto de emisión (ej: 101).
 * @param lastVoucher El objeto del último comprobante emitido. Puede ser null/undefined si es el primero.
 * @returns El nuevo número de factura con el formato SRI (ej: "001-101-000000046").
 */
export const getVoucherNumberSRI = (
  codigoEstablecimiento: number,
  puntoEmision: number,
  lastVoucher?: Voucher | null // Hacemos que sea opcional
): string => {
  // --- 1. Formatear Establecimiento y Punto de Emisión (son constantes) ---
  const establecimiento = padNumber(codigoEstablecimiento, 3);
  const punto = padNumber(puntoEmision, 3);

  let siguienteSecuencial: number;

  if (lastVoucher && lastVoucher.invoiceNumber) {
    // --- 2. Extraer y Calcular el Siguiente Secuencial ---

    const partesFacturaAnterior = lastVoucher.invoiceNumber.split("-");

    // Verificación de formato básico: deben haber 3 partes (EEE-PPP-SSSSSSSSS)
    if (partesFacturaAnterior.length !== 3) {
      // Manejo de error si el formato del número anterior es incorrecto
      console.error("Error: Formato de invoiceNumber anterior inválido.");
      // Puedes lanzar un error o usar una secuencia por defecto
      siguienteSecuencial = 1;
    } else {
      // 2a. Obtener la parte secuencial (la tercera parte)
      const secuencialAnteriorStr = partesFacturaAnterior[2];

      // 2b. CONVERTIR A NÚMERO usando parseInt() o Number() y sumar 1
      const secuencialAnterior = parseInt(secuencialAnteriorStr, 10);

      // Asegurarse de que la conversión fue exitosa
      if (isNaN(secuencialAnterior)) {
        console.error("Error: La parte secuencial no es un número válido.");
        siguienteSecuencial = 1; // Fallback
      } else {
        siguienteSecuencial = secuencialAnterior + 1;
      }
    }
  } else {
    // --- 3. Caso del Primer Comprobante ---
    // Si no hay comprobante anterior, el siguiente número es 1.
    siguienteSecuencial = 1;
  }

  // --- 4. Formatear el Secuencial Siguiente (9 dígitos) ---
  const secuencialFormatoSRI = padNumber(siguienteSecuencial, 9);

  // --- 5. Concatenar y Retornar ---
  return `${establecimiento}-${punto}-${secuencialFormatoSRI}`;
};

export const getPaymentMethodLabel = (methodCode: string) => {
  return mockPaymentsMethod.find(
    (method: PaymentMethod) => method.code === methodCode
  )?.label;
};

export function haveSameKeys(
  obj1: Record<string, any>,
  obj2: Record<string, any>
): boolean {
  const keys1 = Object.keys(obj1).sort();
  const keys2 = Object.keys(obj2).sort();
  return JSON.stringify(keys1) === JSON.stringify(keys2);
}

export function generateSimpleSKU(product: Product): string {
  const normalize = (text: string, length: number = 3) =>
    text
      ?.toUpperCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "") // elimina acentos
      .replace(/[^A-Z0-9]/g, "") // solo letras y números
      .substring(0, length) || "";

  const nameCode = normalize(product.name, 3);

  // Tomar hasta 2 características de additionalFeatures
  const featureCodes = (product.additionalFeatures || [])
    .slice(0, 2) // primeras 2
    .map((attr) => normalize(attr.value, 3)); // ej: "ALG", "RED"

  const months = [
    "ENE",
    "FEB",
    "MAR",
    "ABR",
    "MAY",
    "JUN",
    "JUL",
    "AGO",
    "SEP",
    "OCT",
    "NOV",
    "DIC",
  ];

  const date = new Date(product.createdAt ?? new Date());
  const monthCode = months[date.getMonth()];
  const year = String(date.getFullYear()).slice(-2);

  // Construir partes dinámicamente
  const parts = [nameCode, ...featureCodes, `${monthCode}${year}`].filter(
    Boolean
  );

  return parts.join("-");
}
