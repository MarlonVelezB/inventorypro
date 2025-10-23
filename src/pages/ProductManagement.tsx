import { Modal } from "antd";
import {
  ProductForm,
  ProductHeaderPanel,
  ProductTable,
} from "../features/product-management";
import useModalStore from "../store/ModalStore";
import { HeaderSection } from "../components";
import { KEY_MODALS } from "../utils/testData";
import ExcelUploader from "../features/export-excel/ExcelUploader";

const ProductManagement = () => {
  const { closeModal, isModalOpen, openModal } = useModalStore();

  const handleExportItems = () => {};

  const handleImportItems = () => {
    openModal(KEY_MODALS["import-items"]);
  };

  return (
    <div className="space-y-6">
      <HeaderSection
        title="Product Management"
        sectionDescription="Manage your product inventory and control stock across multiple warehouses."
      />

      <ProductHeaderPanel
        onExportItems={handleExportItems}
        onImportItems={handleImportItems}
      />
      <ProductTable />
      <Modal
        title="New Product"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen(KEY_MODALS["add-prodcut"])}
        onCancel={() => closeModal(KEY_MODALS["add-prodcut"])}
        footer={null}
        width={800}
      >
        <ProductForm />
      </Modal>

      <Modal
        title=""
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen(KEY_MODALS["import-items"])}
        onCancel={() => closeModal(KEY_MODALS["import-items"])}
        footer={null}
        width={800}
      >
        <ExcelUploader />
      </Modal>
    </div>
  );
};

export default ProductManagement;
