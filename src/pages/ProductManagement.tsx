import { Modal } from "antd";
import {
  ProductForm,
  ProductHeaderPanel,
  ProductTable,
} from "../features/product-management";
import useModalStore from "../store/ModalStore";
import { HeaderSection } from "../components";

const ProductManagement = () => {
  const { showModal, closeModal } = useModalStore();

  return (
    <div className="space-y-6">
      <HeaderSection
        title="Product Management"
        sectionDescription="Manage your product inventory and control stock across multiple warehouses."
      />

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
