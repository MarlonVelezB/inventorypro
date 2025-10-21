import { useState } from "react";
import { HeaderSection } from "../components";
import PreInvoiceSearchBar from "../features/vauchers/PreInvoiceSearchBar";
import { useNavigate } from "react-router-dom";
import PreInvoiceTable from "../features/vauchers/PreInvoiceTable";
import type { Voucher } from "../types/business.types";

const PreInvoicePage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleEditVoucher = (voucher: Voucher) => {
    console.log('VOUCHER: ', voucher)
  }

    const handleDeleteVoucher = (voucher: Voucher) => {
    console.log('VOUCHER: ', voucher)
  }

    const handleViewVoucher = (voucher: Voucher) => {
    console.log('VOUCHER: ', voucher)
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

      <PreInvoiceTable onEditRow={handleEditVoucher} onDeleteRow={handleDeleteVoucher} onViewRow={handleViewVoucher}/>
    </div>
  );
};

export default PreInvoicePage;
