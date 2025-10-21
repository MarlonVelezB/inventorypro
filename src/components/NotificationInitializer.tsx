import { useEffect } from "react";
import { notification } from "antd";
import { useMessageStore } from "../store/MessageStore";

const NotificationInitializer = () => {
  const [api, contextHolder] = notification.useNotification();
  const setNotificationApi = useMessageStore((state) => state.setNotificationApi);

  useEffect(() => {
    setNotificationApi(api, contextHolder);
  }, [api, contextHolder, setNotificationApi]);

  return <>{contextHolder}</>;
};

export default NotificationInitializer;
