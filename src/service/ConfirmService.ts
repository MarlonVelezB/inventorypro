// services/confirmService.ts

import { useConfirmStore } from "../store/ConfirmStore";

interface ConfirmOptions {
  title: string;
  message: string;
  type?: "warning" | "danger" | "success" | "info";
  confirmText?: string;
  cancelText?: string;
  showCancelButton?: boolean;
}

export const confirmService = {
  show: (options: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      useConfirmStore.getState().showConfirm(
        options,
        () => resolve(true),
        () => resolve(false)
      );
    });
  },

  warning: (title: string, message: string, options?: Partial<ConfirmOptions>) =>
    confirmService.show({ title, message, type: "warning", ...options }),

  danger: (title: string, message: string, options?: Partial<ConfirmOptions>) =>
    confirmService.show({ title, message, type: "danger", ...options }),

  success: (title: string, message: string, options?: Partial<ConfirmOptions>) =>
    confirmService.show({ title, message, type: "success", ...options }),

  info: (title: string, message: string, options?: Partial<ConfirmOptions>) =>
    confirmService.show({ title, message, type: "info", ...options }),
};