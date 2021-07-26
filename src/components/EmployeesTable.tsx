import { message, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { FetchEmployees } from "../services";

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

  const columns: ColumnsType<Employee> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text: string) => <a>{text}</a>
    },
    {
      title: "Name",
      dataIndex: "employee_name",
      key: "employee_name"
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
