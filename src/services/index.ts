import axios from "axios";
import { getBase64FromBlob } from "../utils";

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

export const FetchProfileImage = async (employeeName: string) => {
  try {
    const profileImage = await axios.get(`https://robohash.org/${employeeName}`, {
      responseType: "blob"
    });
    const imgBase64 = await getBase64FromBlob(profileImage?.data);
    return imgBase64;
  } catch (e) {
    throw e;
  }
};
