import axios from "axios";

export const FetchEmployees = async () => {
  try {
    const employees = await axios.get("https://dummy.restapiexample.com/api/v1/employees");
    return employees?.data;
  } catch (e) {
    throw e;
  }
};
