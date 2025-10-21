// components/ModalConfirmation.tsx
import { Modal } from "antd";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import { useConfirmStore } from "../store/ConfirmStore";

const ModalConfirmation: React.FC = () => {
  const { isOpen, options, confirm, cancel } = useConfirmStore();

  if (!options) return null;

  const typeConfig = {
    warning: {
      icon: AlertTriangle,
      iconColor: "text-yellow-500",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      buttonColor: "bg-yellow-500 hover:bg-yellow-600",
    },
    danger: {
      icon: XCircle,
      iconColor: "text-red-500",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      buttonColor: "bg-red-500 hover:bg-red-600",
    },
    success: {
      icon: CheckCircle,
      iconColor: "text-green-500",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      buttonColor: "bg-green-500 hover:bg-green-600",
    },
    info: {
      icon: Info,
      iconColor: "text-blue-500",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      buttonColor: "bg-blue-500 hover:bg-blue-600",
    },
  };

  const config = typeConfig[options.type || "warning"];
  const IconComponent = config.icon;

  return (
    <Modal
      open={isOpen}
      onCancel={cancel}
      footer={null}
      centered
      closeIcon={null}
      width={440}
      className="modal-confirmation"
      maskClosable={false}
    >
      <div className="p-6">
        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${config.bgColor} ${config.borderColor} border-2`}
          >
            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
          </div>
        </div>

        <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
          {options.title}
        </h3>

        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          {options.message}
        </p>

        <div className="flex gap-3">
          {(options.showCancelButton ?? true) && (
            <button
              onClick={cancel}
              className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors"
            >
              {options.cancelText || "Cancel"}
            </button>
          )}
          <button
            onClick={confirm}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors ${config.buttonColor}`}
          >
            {options.confirmText || "Confirm"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmation;