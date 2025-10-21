import { Button, Space, Table, Tag, type TableColumnsType } from "antd";
import type { Customer } from "../../types/business.types";
import { useState } from "react";
import type { TableRowSelection } from "antd/es/table/interface";
import type { ResizeCallbackData } from "react-resizable";
import { Icon, ResizableTitle } from "../../components";
import { useCustomerStore } from "../../store/useCustomerStore";

interface CustomerTableProps {
  onEditRow: (row: Customer) => void;
  onDeleteRow: (row: Customer) => void;
  onDeleteRowSelected: () => void;
}

const CustomerTable: React.FC<CustomerTableProps> = ({
  onEditRow,
  onDeleteRow,
  onDeleteRowSelected
}) => {
  const [columns, setColumns] = useState<TableColumnsType<Customer>>([
    {
      title: "Code",
      dataIndex: "code",
      width: 100,
    },
    {
      title: "Name",
      dataIndex: "name",
      width: 150,
    },
    {
      title: "Last Name",
      dataIndex: "lastname",
      width: 150,
    },
    {
      title: "Email",
      dataIndex: "email",
      width: 200,
    },
    {
      title: "Phone",
      dataIndex: "phone",
      width: 150,
    },
    {
      title: "DNI",
      dataIndex: "dni",
      width: 120,
    },
    {
      title: "Address",
      dataIndex: "address",
      width: 250,
    },
    {
      title: "Status",
      dataIndex: "status",
      width: 120,
      render: (status: Customer["status"]) => {
        let color = "";
        switch (status) {
          case "active":
            color = "green";
            break;
          case "pending":
            color = "orange";
            break;
          case "inactive":
            color = "red";
            break;
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      fixed: "right",
      render: (_, record) => (
        <Space size="middle">
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

  const { customers, filteredCustomers, selectedCustomers, setSeletedCustomers } = useCustomerStore();

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    console.log("selectedRowKeys changed: ", newSelectedRowKeys);
    setSeletedCustomers(newSelectedRowKeys)
  };

  const rowSelection: TableRowSelection<Customer> = {
    selectedRowKeys: selectedCustomers,
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

  const handleDeleteRowsSelected = () => {
    onDeleteRowSelected();
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
      {/* Table Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            Lista de Clientes ({customers?.length})
          </h3>
          <div className="flex items-center space-x-2">
            <Button
              variant="outlined"
              icon={<Icon name="Download" size={16} />}
              iconPosition="start"
              onClick={() => console.log("Export clients")}
            >
              Exportar
            </Button>
            {selectedCustomers?.length > 0 && (
              <div className="flex items-center gap-3">
                <Button
                  variant="outlined"
                  icon={<Icon name="Minus" />}
                  iconPosition="start"
                  onClick={() => setSeletedCustomers([])}
                >
                  Deseleccionar ({selectedCustomers?.length})
                </Button>

                <Button
                  danger
                  icon={<Icon name="Trash2" />}
                  iconPosition="start"
                  onClick={handleDeleteRowsSelected}
                >
                  Eliminar ({selectedCustomers?.length})
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="hidden lg:block overflow-x-auto">
        <Table<Customer>
          rowKey="id"
          rowSelection={rowSelection}
          columns={mergedColumns}
          dataSource={
            filteredCustomers.length === 0 ? customers : filteredCustomers
          }
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

export default CustomerTable;
