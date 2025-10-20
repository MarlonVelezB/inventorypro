import { Modal } from "antd";
import { AlertTriangle, CheckCircle, Info, XCircle } from "lucide-react";
import useModalStore from "../store/ModalStore";

interface ModalConfirmationProps {
  title: string;
  message: string;
  onAccept: () => void;
  onCancel: () => void;
  type?: "warning" | "danger" | "success" | "info";
  acceptText?: string;
  cancelText?: string;
  loading?: boolean;
}

const ModalConfirmation: React.FC<ModalConfirmationProps> = ({
  title,
  message,
  onAccept,
  onCancel,
  type = "warning",
  acceptText = "Confirm",
  cancelText = "Cancel",
  loading = false,
}) => {
  const { showModal, closeModal } = useModalStore();

  const handleOk = () => {
    closeModal();
    onAccept();
  };

  const handleCancel = () => {
    closeModal();
    onCancel();
  };

  // Configuración de iconos y colores según el tipo
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

  const config = typeConfig[type];
  const IconComponent = config.icon;

  return (
    <Modal
      open={showModal}
      onCancel={handleCancel}
      footer={null}
      centered
      closeIcon={null}
      width={440}
      className="modal-confirmation"
    >
      <div className="p-6">
        {/* Icon Header */}
        <div className="flex items-center justify-center mb-4">
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center ${config.bgColor} ${config.borderColor} border-2`}
          >
            <IconComponent className={`w-8 h-8 ${config.iconColor}`} />
          </div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-center text-gray-900 mb-3">
          {title}
        </h3>

        {/* Message */}
        <p className="text-center text-gray-600 mb-6 leading-relaxed">
          {message}
        </p>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          <button
            onClick={handleOk}
            disabled={loading}
            className={`flex-1 px-4 py-2.5 rounded-lg text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${config.buttonColor}`}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Processing...
              </span>
            ) : (
              acceptText
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ModalConfirmation;