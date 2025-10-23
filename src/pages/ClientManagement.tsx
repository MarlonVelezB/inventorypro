import { useEffect, useState } from "react";
import { HeaderSection, LoadingScreen } from "../components";
import type { Customer } from "../types/business.types";
import { KEY_MODALS, mockClients } from "../utils/testData";
import {
  CustomerForm,
  CustomerSearchBar,
  CustomerTable,
} from "../features/customer-management";
import { Modal } from "antd";
import useModalStore from "../store/ModalStore";
import type { CustomerFormData } from "../features/customer-management/validation/CustomerFormValidationSchema";
import { useCustomerStore } from "../store/useCustomerStore";
import { confirmService } from "../service/ConfirmService";

const ClientManagement = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [clients, setClients] = useState<Customer[]>([]);
  const [selectedClients, setSelectedClients] = useState<Customer[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [formMode, setFormMode] = useState<"create" | "edit">("create");
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const { isModalOpen, closeModal, openModal } = useModalStore();
  const { setCustomers, searchByTerm, deleteSelectedCustomers } =
    useCustomerStore();

  useEffect(() => {
    // Simulate loading
    const loadClients = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setCustomers(mockClients);
      setIsLoading(false);
    };

    loadClients();
  }, []);

  useEffect(() => {
    searchByTerm(searchTerm?.toLowerCase());
  }, [clients, searchTerm]);

  const handleSort = (key: string) => {
    let direction = "asc";
    if (sortConfig?.key === key && sortConfig?.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const handleBulkExport = () => {
    console.log("Exporting selected clients:", selectedClients);
    // Implement bulk export logic
  };

  const deleteRowsSelected = async () => {
    const confirmed = await confirmService.danger(
      "Delete Customer",
      "Are you sure you want to delete this customer?",
      {
        confirmText: "Yes, delete",
        cancelText: "Cancel",
      }
    );

    if (confirmed) {
      // Usuario confirmó
      deleteSelectedCustomers();
      setSelectedClients([]);
    }
  };

  const handleSubmitCustomerForm = (data: CustomerFormData) => {
    console.log("DATA FORM: ", data);
  };

  const handleEditCustomer = (customerToEdit: Customer) => {
    console.log("CUSTOMER EDIT: ", customerToEdit);
  };

  const handleDeleteCustomer = (customerToDelete: Customer) => {
    console.log("CUSTOMER DELETE: ", customerToDelete);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading clients..." />;
  }

  return (
    <div className="space-y-6">
      <HeaderSection
        title="Customer Management"
        sectionDescription="Manage your customers' information and generate pro-forma invoices"
      />

      <CustomerSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewClient={() => openModal(KEY_MODALS["add-prodcut"])}
      />

      <CustomerTable
        onEditRow={handleEditCustomer}
        onDeleteRow={handleDeleteCustomer}
        onDeleteRowSelected={deleteRowsSelected}
      />

      <Modal
        title="New Customer"
        closable={{ "aria-label": "Custom Close Button" }}
        open={isModalOpen(KEY_MODALS["add-prodcut"])}
        onCancel={() => closeModal(KEY_MODALS["add-prodcut"])}
        footer={null}
        width={800}
      >
        <CustomerForm mode={formMode} onSubmit={handleSubmitCustomerForm} />
      </Modal>
    </div>
  );
};

export default ClientManagement;
