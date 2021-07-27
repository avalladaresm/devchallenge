import { message } from "antd";

export const success = (successMessage: string) => {
  message.success(successMessage);
};

export const error = (error: string) => {
  message.error(error);
};
