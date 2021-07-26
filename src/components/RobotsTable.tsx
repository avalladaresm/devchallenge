import { Table } from "antd";
import { useEffect } from "react";
import { FetchRobots } from "../services";

const RobotsTable = () => {
  useEffect(() => {
    (async () => {
      const robots = await FetchRobots();
    })();
  }, []);

  return <Table></Table>;
};

export default RobotsTable;
