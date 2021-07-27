import { Button, Input, message, Slider, Spin, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { FetchEmployees } from "../services";
import { formatCurrency, getMaxValue } from "../utils";
import EmployeeDetails from "./EmployeeDetails";

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
  const [_searchText, _setSearchText] = useState("");
  const [_isModalVisible, _setIsModalVisible] = useState(false);
  const [_employeeDetails, _setEmployeeDetails] = useState<Employee>();

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

  useEffect(() => {
    const temp = [..._employees];
    const result = temp
      .filter((employee) =>
        employee.employee_name.toString().toLowerCase().includes(_searchText.toLowerCase())
      )
      .filter(
        (employee) =>
          employee.employee_age > (_currentAgeRange ? _currentAgeRange[0] : 0) &&
          employee.employee_age < (_currentAgeRange ? _currentAgeRange[1] : 100)
      )
      .filter(
        (employee) =>
          employee.employee_salary > (_currentSalaryRange ? _currentSalaryRange[0] : 0) &&
          employee.employee_salary < (_currentSalaryRange ? _currentSalaryRange[1] : 100)
      );
    _setSearchedEmployees(result);
  }, [_searchText, _currentAgeRange, _currentSalaryRange, _employees]);

  const resetFilters = () => {
    _setSearchedEmployees(null);
    _setSearchText("");
    const oldestAge = getMaxValue(_employees, "employee_age")?.employee_age ?? 100;
    const highestSalary = getMaxValue(_employees, "employee_salary")?.employee_salary ?? 100;
    _setOldestAge(oldestAge);
    _setHighestSalary(highestSalary);
    _setCurrentAgeRange([0, oldestAge]);
    _setCurrentSalaryRange([0, highestSalary]);
  };

  const viewEmployeeDetails = (record: Employee) => {
    _setIsModalVisible(true);
    _setEmployeeDetails(record);
  };

  const columns: ColumnsType<Employee> = [
    {
      title: "Id",
      dataIndex: "id",
      key: "id",
      render: (text: string, record: Employee) => (
        <Button type="link" onClick={() => viewEmployeeDetails(record)}>
          {text}
        </Button>
      )
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

  const handleOk = () => {
    _setIsModalVisible(false);
  };

  const handleCancel = () => {
    _setIsModalVisible(false);
  };

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
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start"
          }}
        >
          <h2 style={{ textAlign: "left", fontWeight: 600, width: "auto" }}>Filters</h2>
          <Button type="link" onClick={() => resetFilters()}>
            Clear filters
          </Button>
        </div>
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
            <Search
              placeholder="input search text"
              onSearch={(value) => _setSearchText(value)}
              onChange={(event) => _setSearchText(event.target.value)}
              value={_searchText}
              enterButton
              allowClear
            />
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
                    onChange={(range) => _setCurrentAgeRange(range)}
                    value={_currentAgeRange}
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
                      onChange={(range) => _setCurrentSalaryRange(range)}
                      value={_currentSalaryRange}
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
      {_employeeDetails && (
        <EmployeeDetails
          isModalVisible={_isModalVisible}
          handleOk={handleOk}
          handleCancel={handleCancel}
          employeeDetails={_employeeDetails}
        />
      )}
    </div>
  );
};

export default EmployeesTable;
