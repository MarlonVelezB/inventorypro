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
import { useEffect } from "react";
import { useProductStore } from "../store/ProductStore";
import { productsService } from "../service/core/productService";

const ProductManagement = () => {
  const { closeModal, isModalOpen, openModal } = useModalStore();
  const { setProducts, products } = useProductStore();

  useEffect(() => {
    // API del navegador que te permite cancelar operaciones asíncronas
    // Lo usamos para poder abortar una peticio HTPP cuando se desponde el componente y asi evitar el doble render
    const controller = new AbortController(); // Disponible globalmente
    const loadProducts = async () => {
      try {
        // controller.signal "antena" que escucha si se canceló algo
        const res = await productsService.getAll(controller.signal);
        setProducts(res);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setProducts([]);
        }
      }
    };

    loadProducts();

    return () => {
      controller.abort(); // Cancela cuando el componente se desmonta
    };
  }, []);

  const handleExportItems = () => {};

  const handleImportItems = () => {
    openModal(KEY_MODALS["import-items"]);
  };

  const handleFinalyImport = () => {
    closeModal(KEY_MODALS["import-items"]);
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

      <ProductTable loadingData={products.length === 0} />

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
        <ExcelUploader finalyImport={handleFinalyImport} />
      </Modal>
    </div>
  );
};

export default ProductManagement;
