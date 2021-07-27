import { Button, Form, Input, message, Modal } from "antd";
import { useState } from "react";
import { DeleteEmployee, UpdateEmployee } from "../services";

const success = (successMessage: string) => {
  message.success(successMessage);
};

const error = (error: string) => {
  message.error(error);
};

const EmployeeDetails = ({ isModalVisible, setIsModalVisible, employeeDetails }: any) => {
  const { id, employee_name, employee_age, employee_salary, profile_image } = employeeDetails;
  const [_isUpdating, _setIsUpdating] = useState(false);
  const [_isDeleting, _setIsDeleting] = useState(false);

  const [form] = Form.useForm();

  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 4 }
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 16 }
    }
  };

  const handleUpdateEmployee = async () => {
    try {
      _setIsUpdating(true);
      const result = await UpdateEmployee(id);
      success(result?.message);
      setIsModalVisible(false);
    } catch (e) {
      error(e.response.data?.message);
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
      error(e.response.data?.message);
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
                handleUpdateEmployee();
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
        <Form.Item label="Salary" name="employee_salary">
          <Input disabled={_isUpdating} />
        </Form.Item>
        <Form.Item label="Age" name="employee_age" valuePropName="value">
          <Input disabled={_isUpdating} />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeDetails;
