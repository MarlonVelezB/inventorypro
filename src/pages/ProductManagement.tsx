import { Modal } from "antd";
import {
  ProductForm,
  ProductHeaderPanel,
  ProductTable,
} from "../features/product-management";
import useModalStore from "../store/ModalStore";
import { HeaderSection, LoadingScreen } from "../components";
import { KEY_MODALS } from "../utils/testData";
import ExcelUploader from "../features/export-excel/ExcelUploader";
import { useEffect, useState } from "react";
import { useProductStore } from "../store/ProductStore";
import { productsService } from "../service/core/productService";

const ProductManagement = () => {
  const { closeModal, isModalOpen, openModal } = useModalStore();
  const [isLoading, setIsLoading] = useState(true);
  const { setProducts } = useProductStore();

  useEffect(() => {
    // API del navegador que te permite cancelar operaciones asíncronas
    // Lo usamos para poder abortar una peticio HTPP cuando se desponde el componente y asi evitar el doble render
    const controller = new AbortController(); // Disponible globalmente

    const loadProducts = async () => {
      setIsLoading(true);

      try {
        // controller.signal "antena" que escucha si se canceló algo
        const res = await productsService.getAll(controller.signal);
        setProducts(res);
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          setProducts([]);
        }
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return <LoadingScreen message="Loading products..." />;
  }

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
