import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { index, store } from "~/services/controller";
import { useSelector } from "react-redux";
import { Space, Table, Tooltip, Modal } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined
} from "@ant-design/icons";
import { convertDate, convertMoney } from "~/modules/Util";

function Solicitacoes() {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);

  const [solicitacoes, setSolicitacoes] = useState([]);
  const [reload, setReload] = useState(false);

  useEffect(() => {
    index("solicitacoes_saque", {
      clinica_id: selectedClinic.id,
      status: "pendente"
    }).then(({ data }) => {
      setSolicitacoes(data);
    });
  }, [selectedClinic.id, reload]);

  const columns = [
    {
      title: "Data",
      dataIndex: "data",
      render: data => <span>{convertDate(data)}</span>
    },
    {
      title: "Dentista",
      dataIndex: "dentista",
      render: data => (
        <span>
          {data.firstName} {data.lastName}
        </span>
      )
    },
    {
      title: "Descrição",
      dataIndex: "descricao"
    },
    {
      title: "Valor",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: "Ações",
      render: data => (
        <Space>
          <Tooltip title="Aprovar">
            <a style={{ fontSize: 20 }} onClick={() => confirm(data)}>
              <CheckCircleOutlined />
            </a>
          </Tooltip>
        </Space>
      )
    }
  ];

  function confirm(data) {
    Modal.confirm({
      title: "Confirmar",
      icon: <ExclamationCircleOutlined />,
      content: `Deseja confirmar solicitação de saque de ${data.dentista.firstName
        } ${data.dentista.lastName}, no valor de ${convertMoney(data.valor)} ?`,
      okText: "Sim",
      cancelText: "Nâo",
      onOk: () => handleAprovar(data.id)
    });
  }

  const handleAprovar = id => {
    store(`solicitacoes_saque/${id}`).then(({ data }) => {
      setReload(!reload);
    });
  };

  return (
    <Container>
      <Table columns={columns} dataSource={solicitacoes} size="small" />
    </Container>
  );
}

export default Solicitacoes;
