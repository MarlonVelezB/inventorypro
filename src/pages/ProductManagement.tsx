import { Modal } from "antd";
import {
  ProductForm,
  ProductHeaderPanel,
  ProductTable,
} from "../features/product-management";
import useModalStore from "../store/ModalStore";

const ProductManagement = () => {
  const {showModal, closeModal} = useModalStore();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Gestión de Productos
        </h1>
        <p className="text-muted-foreground mt-1">
          Administra tu inventario de productos y controla el stock en múltiples
          almacenes
        </p>
      </div>

      <ProductHeaderPanel />
      <ProductTable />
      <Modal
        title="New Product"
        closable={{ "aria-label": "Custom Close Button" }}
        open={showModal}
        onCancel={closeModal}
        footer={null}
        width={800}
      >
        <ProductForm />
      </Modal>
    </div>
  );
};

export default ProductManagement;
