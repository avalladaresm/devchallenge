import { Input, message, Slider, Spin, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { FetchEmployees } from "../services";
import { formatCurrency, getMaxValue } from "../utils";

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
  const [_highestSalary, _setHighestSalary] = useState<number>();
  const [_currentAgeRange, _setCurrentAgeRange] = useState<[number, number]>();
  const [_currentSalaryRange, _setCurrentSalaryRange] = useState<[number, number]>();

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
      const oldestAge = getMaxValue(_employees, "employee_age")?.employee_age ?? 100;
      const highestSalary = getMaxValue(_employees, "employee_salary")?.employee_salary ?? 100;
      _setOldestAge(oldestAge);
      _setHighestSalary(highestSalary);
      _setCurrentAgeRange([0, oldestAge]);
      _setCurrentSalaryRange([0, highestSalary]);
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
    _setCurrentAgeRange(range);
  };

  const onSalaryRangeChange = (range: [number, number]) => {
    const filteredEmployees = _employees.filter(
      (employee) => employee.employee_salary > range[0] && employee.employee_salary < range[1]
    );
    _setSearchedEmployees(filteredEmployees);
    _setCurrentSalaryRange(range);
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
      render: (text: number) => <span>{formatCurrency(text)}</span>,
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
    <div style={{ padding: 20, backgroundColor: "#F3F4F6", height: "100vh" }}>
      <div
        style={{
          padding: 10,
          backgroundColor: "#D1D5DB",
          borderWidth: 3,
          borderColor: "#6B7280",
          borderStyle: "solid",
          borderRadius: 10,
          marginBottom: 20
        }}
      >
        <legend style={{ textAlign: "left", fontWeight: 600 }}>Filters</legend>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
            marginBottom: 20
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%"
            }}
          >
            <h4 style={{ textAlign: "left" }}>Search employee by name</h4>
            <Search placeholder="input search text" onSearch={onSearch} enterButton />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%"
            }}
          >
            <Spin spinning={_isLoading}>
              {_oldestAge && (
                <div>
                  <h4 style={{ textAlign: "left" }}>Filter employee by range of age</h4>
                  <Slider
                    range
                    max={_oldestAge}
                    defaultValue={[0, _oldestAge]}
                    onChange={onAgeRangeChange}
                  />
                  <h4 style={{ textAlign: "left" }}>
                    min: {_currentAgeRange && _currentAgeRange[0]}, max:{" "}
                    {_currentAgeRange && _currentAgeRange[1]}
                  </h4>
                </div>
              )}
            </Spin>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "30%"
            }}
          >
            <Spin spinning={_isLoading}>
              {_highestSalary && (
                <div>
                  <h4 style={{ textAlign: "left" }}>Filter employee by range of salary</h4>
                  <div>
                    <Slider
                      range
                      max={_highestSalary}
                      defaultValue={[0, _highestSalary]}
                      onChange={onSalaryRangeChange}
                      tipFormatter={(value) => formatCurrency(value)}
                    />
                  </div>
                  <h4 style={{ textAlign: "left" }}>
                    min: {_currentSalaryRange && formatCurrency(_currentSalaryRange[0])}, max:{" "}
                    {_currentSalaryRange && formatCurrency(_currentSalaryRange[1])}
                  </h4>
                </div>
              )}
            </Spin>
          </div>
        </div>
      </div>
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
