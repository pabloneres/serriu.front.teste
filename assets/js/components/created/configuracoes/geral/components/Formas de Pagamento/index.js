import React, { useEffect, useState } from "react";

import { Container } from "./styles";
import { Table, Card, Button, Modal, Input, Form } from "antd";
import { index } from "~/controllers/controller";
import { useSelector } from "react-redux";

function FormasPagamento() {
  const { token } = useSelector(state => state.auth);
  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState();

  const [metodos, setMetodos] = useState([]);

  const columns = [
    {
      title: "Nome",
      dataIndex: "name"
    }
    // {
    //   title: "Ações",
    //   width: 120
    // }
  ];

  useEffect(() => {
    index(token, "metodosPagamento").then(({ data }) => {
      setMetodos(data);
    });
  }, [token]);

  return (
    // <Card
    //   title="Formas de Pagamento"
    //   extra={
    //     <Button type="primary" onClick={() => setShowModal(true)}>
    //       Adicionar
    //     </Button>
    //   }
    // >
    //   <Modal
    //     title="Adicionar Forma de Pagamento"
    //     visible={showModal}
    //     onCancel={() => setShowModal(false)}
    //   >
    //     <Form layout="vertical">
    //       <Form.Item label="Nome">
    //         <Input onChange={e => setName(e.target.value)} value={name} />
    //       </Form.Item>
    //     </Form>
    //   </Modal>
    // </Card>
    <Table size="small" columns={columns} dataSource={metodos} />
  );
}

export default FormasPagamento;
