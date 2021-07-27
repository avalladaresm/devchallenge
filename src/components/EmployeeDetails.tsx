import { Form, Input, Modal } from "antd";

const EmployeeDetails = ({
  isModalVisible,
  handleSaveEmployee,
  handleCancel,
  employeeDetails
}: any) => {
  const { id, employee_name, employee_age, employee_salary, profile_image } = employeeDetails;

  const onFinish = (values: any) => {
    console.log("Success:", values);
  };

  const onFinishFailed = (errorInfo: any) => {
    console.log("Failed:", errorInfo);
  };

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

  return (
    <Modal
      title="Employee details"
      visible={isModalVisible}
      onOk={handleSaveEmployee}
      onCancel={handleCancel}
      destroyOnClose
    >
      <Form
        {...formItemLayout}
        name="basic"
        initialValues={{
          id: id,
          employee_name: employee_name,
          employee_salary: employee_salary,
          employee_age: employee_age
        }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
      >
        <Form.Item label="Id" name="id">
          <Input disabled />
        </Form.Item>
        <Form.Item label="Name" name="employee_name">
          <Input />
        </Form.Item>
        <Form.Item label="Salary" name="employee_salary">
          <Input />
        </Form.Item>
        <Form.Item label="Age" name="employee_age" valuePropName="value">
          <Input />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EmployeeDetails;
