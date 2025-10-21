import { Button, Space, Table, Tag, type TableColumnsType } from "antd";
import { useState } from "react";
import type { Voucher } from "../../types/business.types";
import type { TableRowSelection } from "antd/es/table/interface";
import type { ResizeCallbackData } from "react-resizable";
import { mockPreInvoices } from "../../utils/testData";
import { Icon, ResizableTitle } from "../../components";

interface PreInvoiceTableProps {
  onEditRow: (row: Voucher) => void;
  onDeleteRow: (row: Voucher) => void;
  onViewRow: (row: Voucher) => void;
  onDeleteRowSelected?: () => void;
}

const PreInvoiceTable: React.FC<PreInvoiceTableProps> = ({onEditRow, onDeleteRow, onViewRow}) => {
  const [columns, setColumns] = useState<TableColumnsType<Voucher>>([
    {
      title: "Invoice #",
      dataIndex: "invoiceNumber",
      width: 150,
    },
    {
      title: "Issue Date",
      dataIndex: "issueDate",
      width: 150,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Customer",
      dataIndex: ["customer", "name"],
      width: 180,
      render: (_, record) =>
        `${record.customer.name} ${record.customer.lastname}`,
    },
    {
      title: "Email",
      dataIndex: ["customer", "email"],
      width: 200,
    },
    {
      title: "Total",
      dataIndex: "total",
      width: 120,
      render: (value: number) => `$${value.toFixed(2)}`,
    },
    {
      title: "Payment Method",
      dataIndex: "paymentMethod",
      width: 160,
      render: (method: Voucher["paymentMethod"]) => method || "—",
    },
    {
      title: "Status",
      dataIndex: "paymentStatus",
      width: 130,
      render: (status: Voucher["paymentStatus"]) => {
        let color = "";
        switch (status) {
          case "PAID":
            color = "green";
            break;
          case "PENDING":
            color = "orange";
            break;
          case "CANCELLED":
            color = "red";
            break;
        }
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      width: 120,
      render: (_, record) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<Icon name="Eye" size={16} />}
            onClick={() => onViewRow?.(record)}
          />
          <Button
            type="text"
            icon={<Icon name="Pencil" size={16} />}
            onClick={() => onEditRow?.(record)}
          />
          <Button
            type="text"
            danger
            icon={<Icon name="Trash2" size={16} />}
            onClick={() => onDeleteRow?.(record)}
          />
        </Space>
      ),
    },
  ]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
  };

  const rowSelection: TableRowSelection<Voucher> = {
    selectedRowKeys: [],
    onChange: onSelectChange,
  };

  const handleResize =
    (index: number) =>
    (_: React.SyntheticEvent, { size }: ResizeCallbackData) => {
      const newColumns = [...columns];
      newColumns[index] = {
        ...newColumns[index],
        width: size.width,
      };
      setColumns(newColumns);
    };

  const mergedColumns = columns.map((col, index) => ({
    ...col,
    onHeaderCell: (column: any) => ({
      width: column.width,
      onResize: handleResize(index),
    }),
  }));

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      <div className="hidden lg:block overflow-x-auto">
        <Table<Voucher>
          rowKey="id"
          rowSelection={rowSelection}
          columns={mergedColumns}
          dataSource={mockPreInvoices}
          components={{
            header: {
              cell: ResizableTitle,
            },
          }}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} products`,
          }}
          scroll={{ x: "max-content" }}
        />
      </div>
    </div>
  );
};

export default PreInvoiceTable;
