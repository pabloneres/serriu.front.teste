import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { index, store } from "~/controllers/controller";
import { useSelector } from "react-redux";
import { Space, Table, Tooltip, Modal, Card, Tabs } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { convertDate, convertMoney } from "~/modules/Util";

const { TabPane } = Tabs;

function Laboratorio() {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);

  const [labs, setLabs] = useState([]);
  const [reload, setReload] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    index(token, `lab?clinica_id=${selectedClinic.id}`).then(({ data }) => {
      setLabs(data);
      setLoading(false);
    });
  }, [selectedClinic.id, token, reload]);

  const columns = [
    {
      title: "Data",
      dataIndex: "data"
    },
    {
      title: "Dentista",
      dataIndex: "dentista"
    },
    {
      title: "Descrição",
      dataIndex: "descricao"
    },
    {
      title: "Valor",
      dataIndex: "valor"
    },
    {
      title: "Ações"
    }
  ];

  function confirm(data) {
    Modal.confirm({
      title: "Confirmar",
      icon: <ExclamationCircleOutlined />,
      content: `Deseja confirmar solicitação de saque de ${
        data.dentista.firstName
      } ${data.dentista.lastName}, no valor de ${convertMoney(data.valor)} ?`,
      okText: "Sim",
      cancelText: "Nâo",
      onOk: () => handleAprovar(data.id)
    });
  }

  const handleAprovar = id => {
    store(token, `solicitacoes_saque/${id}`).then(({ data }) => {
      setReload(!reload);
    });
  };

  return (
    <Container>
      <Tabs type="card">
        <TabPane key="pendente" tab="Pendente">
          <Table size="small" columns={columns} dataSource={labs} loading />
        </TabPane>
        <TabPane key="pago" tab="Pago"></TabPane>
      </Tabs>
    </Container>
  );
}

export default Laboratorio;
