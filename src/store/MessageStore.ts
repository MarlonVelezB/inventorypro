import { create } from "zustand";
import type { NotificationInstance } from "antd/es/notification/interface";

interface NotificationState {
  api: NotificationInstance | null;
  contextHolder: React.ReactNode | null;
  setNotificationApi: (api: NotificationInstance, contextHolder: React.ReactNode) => void;
}

export const useMessageStore = create<NotificationState>((set) => ({
  api: null,
  contextHolder: null,
  setNotificationApi: (api, contextHolder) => set({ api, contextHolder }),
}));
