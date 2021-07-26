import { Input, message, Slider, Spin, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { FetchEmployees } from "../services";
import { getMaxValue } from "../utils";

const { Search } = Input;

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
  const [_employees, _setEmployees] = useState<Employee[]>([]);
  const [_searchedEmployees, _setSearchedEmployees] = useState<Employee[] | null>(null);
  const [_isLoading, _setIsLoading] = useState(false);
  const [_oldestAge, _setOldestAge] = useState<number>();

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

  useEffect(() => {
    if (_employees.length > 0) {
      _setOldestAge(getMaxValue(_employees, "employee_age")?.employee_age ?? 100);
    }
  }, [_employees]);

  const onSearch = (searchedEmployeeName: string) => {
    const filteredEmployees = _employees.filter((employee) =>
      employee.employee_name.toString().toLowerCase().includes(searchedEmployeeName.toLowerCase())
    );
    searchedEmployeeName.length > 0
      ? _setSearchedEmployees(filteredEmployees)
      : _setSearchedEmployees(null);
  };

  const onAgeRangeChange = (range: [number, number]) => {
    const filteredEmployees = _employees.filter(
      (employee) => employee.employee_age > range[0] && employee.employee_age < range[1]
    );
    _setSearchedEmployees(filteredEmployees);
  };

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

  return (
    <div>
      <Search placeholder="input search text" onSearch={onSearch} enterButton />
      <Spin spinning={_isLoading}>
        {_oldestAge && (
          <Slider
            range={{ draggableTrack: true }}
            defaultValue={[0, _oldestAge]}
            onChange={onAgeRangeChange}
            tooltipVisible
          />
        )}
      </Spin>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={_searchedEmployees ?? _employees}
        loading={_isLoading}
      ></Table>
    </div>
  );
};

export default EmployeesTable;
