import axios from "axios";

export const FetchEmployees = async () => {
  try {
    const employees = await axios.get("https://dummy.restapiexample.com/api/v1/employees");
    return employees?.data;
  } catch (e) {
    throw e;
  }
};

export const UpdateEmployee = async (employeeId: number) => {
  try {
    const updateResult = await axios.put(
      `https://dummy.restapiexample.com/api/v1/update/${employeeId}`
    );
    return updateResult?.data;
  } catch (e) {
    throw e;
  }
};

export const DeleteEmployee = async (employeeId: number) => {
  try {
    const deleteResult = await axios.delete(
      `https://dummy.restapiexample.com/api/v1/delete/${employeeId}`
    );
    return deleteResult?.data;
  } catch (e) {
    throw e;
  }
};
