import axios from "axios";

export const FetchRobots = async () => {
  try {
    const robots = await axios.get("https://dummy.restapiexample.com/api/v1/employees");
    return robots?.data?.data;
  } catch (e) {
    throw e;
  }
};
