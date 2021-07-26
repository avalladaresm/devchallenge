import { Button, Input, message, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { FetchEmployees } from "../services";
import { SearchOutlined } from "@ant-design/icons";

interface Employee {
  id: number;
  employee_name: string;
  employee_salary: number;
  employee_age: number;
  profile_image: string;
}

const success = (successMessage: string) => {
  message.success(successMessage);
};

const error = (error: string) => {
  message.error(error);
};

const EmployeesTable = () => {
  const [_employees, _setEmployees] = useState([]);
  const [_isLoading, _setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        _setIsLoading(true);
        const res = await FetchEmployees();
        _setEmployees(res?.data);
        success(res?.message);
      } catch (e) {
        error(e.response.data?.message);
      }
      mounted && _setIsLoading(false);
      return () => {
        mounted = false;
      };
    })();
  }, []);

  let searchInput: React.LegacyRef<Input> | Input = null;
  const getColumnSearchProps = (dataIndex: any) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }: any) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={(node) => {
            searchInput = node;
          }}
          placeholder={`Search employee name`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => confirm()}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => confirm()}
            icon={<SearchOutlined />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: any) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value: any, record: any) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : "",
    render: (text: string) => text
  });

  const columns: ColumnsType<Employee> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a>{text}</a>
    },
    {
      title: "Employee name",
      dataIndex: "employee_name",
      key: "employee_name",
      ...getColumnSearchProps("employee_name")
    },
    {
      title: "Salary",
      dataIndex: "employee_salary",
      key: "employee_salary",
      responsive: ["sm"]
    },
    {
      title: "Age",
      key: "employee_age",
      dataIndex: "employee_age",
      responsive: ["sm"]
    }
  ];

  return <Table rowKey="id" columns={columns} dataSource={_employees} loading={_isLoading}></Table>;
};

export default EmployeesTable;
