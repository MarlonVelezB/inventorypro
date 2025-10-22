// store/confirmStore.ts
import { create } from "zustand";

interface ConfirmOptions {
  title: string;
  message: string;
  type?: "warning" | "danger" | "success" | "info";
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

interface ConfirmStore {
  isOpen: boolean;
  options: ConfirmOptions | null;
  onConfirm: (() => void) | null;
  onCancel: (() => void) | null;
  
  showConfirm: (
    options: ConfirmOptions,
    onConfirmCallback: () => void,
    onCancelCallback?: () => void
  ) => void;
  
  closeConfirm: () => void;
  confirm: () => void;
  cancel: () => void;
}

export const useConfirmStore = create<ConfirmStore>((set, get) => ({
  isOpen: false,
  options: null,
  onConfirm: null,
  onCancel: null,

  showConfirm: (options, onConfirmCallback, onCancelCallback) => {
    set({
      isOpen: true,
      options,
      onConfirm: onConfirmCallback,
      onCancel: onCancelCallback || null,
    });
  },

  closeConfirm: () => {
    set({
      isOpen: false,
      options: null,
      onConfirm: null,
      onCancel: null,
    });
  },

  confirm: () => {
    const { onConfirm } = get();
    get().closeConfirm();
    onConfirm?.();
  },

  cancel: () => {
    const { onCancel } = get();
    get().closeConfirm();
    onCancel?.();
  },
}));