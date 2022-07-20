import React, { useState, useEffect } from "react";

import { Container } from "./styles";
import { Table, Card, Button, Modal, Input, Form } from "antd";
import { index } from "~/controllers/controller";
import { useSelector } from "react-redux";
import { convertMoney } from "~/modules/Util";
import Adicionar from "./components/Adicionar";

function Despesas() {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [showModal, setShowModal] = useState(false);
  const [reload, setReload] = useState(false);

  const [despesas, setDespesas] = useState([]);
  const columns = [
    {
      title: "Nome",
      dataIndex: "name"
    },
    {
      title: "Tipo",
      dataIndex: "tipo"
    },
    {
      title: "Descrição",
      dataIndex: "descricao"
    },
    {
      title: "Valor",
      dataIndex: "valor",
      render: data => <span>{convertMoney(data)}</span>
    }
  ];

  useEffect(() => {
    index(token, `despesas?clinica_id=${selectedClinic.id}`).then(
      ({ data }) => {
        setDespesas(data);
      }
    );
  }, [reload, selectedClinic.id, token]);

  const clean = () => {
    setReload(!reload);
    setShowModal(false);
  };

  return (
    <Card
      title="Despesas"
      extra={
        <Button type="primary" onClick={() => setShowModal(true)}>
          Adicionar
        </Button>
      }
    >
      <Adicionar
        utils={{ clean, clinica_id: selectedClinic.id }}
        show={{ showModal, setShowModal }}
      />
      <Table columns={columns} dataSource={despesas} />
    </Card>
  );
}

export default Despesas;
