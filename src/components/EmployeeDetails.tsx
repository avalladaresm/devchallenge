import { Button, Form, Image, Input, Modal, Spin } from "antd";
import { useEffect, useState } from "react";
import { DeleteEmployee, FetchProfileImage, UpdateEmployee } from "../services";
import { Employee } from "../types";
import { fallbackImage } from "../utils";
import { error, success } from "./Messages";

const EmployeeDetails = ({ isModalVisible, setIsModalVisible, employeeDetails }: any) => {
  const { id, employee_name, employee_age, employee_salary } = employeeDetails;
  const [_isUpdating, _setIsUpdating] = useState(false);
  const [_isDeleting, _setIsDeleting] = useState(false);
  const [_isImageFetching, _setIsImageFetching] = useState(false);
  const [_profileImage, _setProfileImage] = useState<any>("");

  const [form] = Form.useForm();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        _setIsImageFetching(true);
        const res = await FetchProfileImage(employee_name);
        _setProfileImage(res);
      } catch (e) {
        error(e.response?.data?.message ?? "Error fetching image");
      }
      mounted && _setIsImageFetching(false);
      return () => {
        mounted = false;
      };
    })();
  }, [employee_name]);

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  const handleUpdateEmployee = async (data: Employee) => {
    try {
      _setIsUpdating(true);
      const result = await UpdateEmployee(id, data);
      success(result?.message);
      setIsModalVisible(false);
    } catch (e) {
      error(e.response?.data?.message ?? "Error updating employee");
    } finally {
      _setIsUpdating(false);
    }
  };

  const handleDeleteEmployee = async () => {
    try {
      _setIsDeleting(true);
      const result = await DeleteEmployee(id);
      success(result?.message);
      setIsModalVisible(false);
    } catch (e) {
      error(e.response?.data?.message ?? "Error deleting employee");
    } finally {
      _setIsDeleting(false);
    }
  };

  return (
    <Modal
      title="Employee details"
      visible={isModalVisible}
      destroyOnClose
      confirmLoading={_isUpdating || _isDeleting}
      onCancel={() => setIsModalVisible(false)}
      footer={[
        <Button
          key="back"
          disabled={_isUpdating || _isDeleting}
          onClick={() => setIsModalVisible(false)}
        >
          Cancel
        </Button>,
        <Button
          danger
          type="default"
          loading={_isDeleting}
          disabled={_isUpdating}
          onClick={handleDeleteEmployee}
        >
          Delete
        </Button>,
        <Button
          key="submit"
          type="primary"
          loading={_isUpdating}
          disabled={_isDeleting}
          onClick={() => {
            form
              .validateFields()
              .then((values) => {
                handleUpdateEmployee(values);
              })
              .catch((info) => {
                error(info);
              });
          }}
        >
          Update
        </Button>
      ]}
    >
      <Form
        {...formItemLayout}
        form={form}
        name="basic"
        initialValues={{
          id: id,
          employee_name: employee_name,
          employee_salary: employee_salary,
          employee_age: employee_age
        }}
      >
        <Form.Item label="Id" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Name" name="employee_name">
          <Input disabled={_isUpdating} />
        </Form.Item>
        <Form.Item label="Salary ($)" name="employee_salary">
          <Input disabled={_isUpdating} type="number" />
        </Form.Item>
        <Form.Item label="Age" name="employee_age" valuePropName="value">
          <Input disabled={_isUpdating} type="number" />
        </Form.Item>
        <Form.Item label="Profile image" name="profile_image">
          <div style={{ display: "flex", alignItems: "center" }}>
            <Spin spinning={_isImageFetching}>
              <Image
                src={_profileImage}
                style={{
                  borderWidth: 2,
                  borderColor: "#6B7280",
                  borderStyle: "solid",
                  borderRadius: 10
                }}
                fallback={fallbackImage}
              />
            </Spin>
          </div>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeDetails;
