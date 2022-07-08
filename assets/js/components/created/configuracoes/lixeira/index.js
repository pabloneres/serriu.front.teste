import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { Table, Card, Tabs } from "antd";

const { TabPane } = Tabs;

function Lixeira() {
  const [key, setKey] = useState("users");

  return (
    <Card title="Lixeira">
      <Tabs activeKey={key} onChange={setKey}>
        <TabPane tab="Usuário" key="users">
          <Table />
        </TabPane>
        <TabPane tab="Paciente" key="patients">
          <Table />
        </TabPane>
      </Tabs>
    </Card>
  );
}

export default Lixeira;
