import { useEffect, useState } from "react";
import { HeaderSection, LoadingScreen } from "../components";
import PreInvoiceSearchBar from "../features/vauchers/PreInvoiceSearchBar";
import { useNavigate } from "react-router-dom";
import PreInvoiceTable from "../features/vauchers/PreInvoiceTable";
import type { Voucher } from "../types/business.types";
import { useVoucherStore } from "../store/VoucherStore";
import { mockPreInvoices } from "../utils/testData";

const PreInvoicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);

  const { setVouchers } = useVoucherStore();

  useEffect(() => {
    // Simulate loading
    const loadVouchers = async () => {
      setIsLoading(true);
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setVouchers(mockPreInvoices);
      setIsLoading(false);
    };

    loadVouchers();
  }, []);

  const handleEditVoucher = (voucher: Voucher) => {
    console.log("VOUCHER: ", voucher);
  };

  const handleDeleteVoucher = (voucher: Voucher) => {
    console.log("VOUCHER: ", voucher);
  };

  const handleViewVoucher = (voucher: Voucher) => {
    console.log("VOUCHER: ", voucher);
  };

  if (isLoading) {
    return <LoadingScreen message="Loading vouchers..." />;
  }

  return (
    <div className="space-y-6">
      <HeaderSection
        title="Pre-Invoice Center"
        sectionDescription="Generate and organize pre-invoices for your clients with ease"
      />

      <PreInvoiceSearchBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onNewPreInvoice={() => navigate("/voucher/pre-invoice-generator")}
      />

      <PreInvoiceTable
        onEditRow={handleEditVoucher}
        onDeleteRow={handleDeleteVoucher}
        onViewRow={handleViewVoucher}
      />
    </div>
  );
};

export default PreInvoicePage;
