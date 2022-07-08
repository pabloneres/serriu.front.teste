import React, { useState, useEffect } from "react";

import { Container } from "./styles";
import { Modal, Form, Input } from "antd";
import InputMask from "~/utils/mask";
import { store, show, update } from "~/controllers/controller";
import { useSelector } from "react-redux";

function DrawerCliente({
  editCliente,
  setEditCliente,
  setUpdateClientes,
  updateClientes
}) {
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [data, setData] = useState({});

  useEffect(() => {
    if (editCliente) {
      show(token, "patient", editCliente).then(({ data }) => {
        setData(data);
      });
    }
  }, [editCliente, token]);

  const handleSend = () => {
    update(token, "patient", editCliente, {
      firstName: data.firstName,
      lastName: data.lastName,
      tel: data.tel
    }).then(() => {
      setData({});
      setEditCliente(undefined);
      setUpdateClientes(!updateClientes);
    });
  };

  useEffect(() => {
    setData(editCliente);
  }, [editCliente]);

  return (
    <Container>
      <Modal
        visible={editCliente ? true : false}
        onOk={() => handleSend()}
        onCancel={() => setEditCliente(undefined)}
      >
        {data ? (
          <Form layout="vertical">
            <Form.Item label="Nome">
              <Input
                placeholder="Nome"
                onChange={e => setData({ ...data, firstName: e.target.value })}
                value={data.firstName}
              />
            </Form.Item>
            <Form.Item label="Sobrenome">
              <Input
                placeholder="Sobrenome"
                onChange={e => setData({ ...data, lastName: e.target.value })}
                value={data.lastName}
              />
            </Form.Item>
            {/* <Form.Item label="Email">
            <Input
              type="email"
              placeholder="Email"
              onChange={e => setData({ ...data, email: e.target.value })}
              value={data.email}
            />
          </Form.Item> */}
            <Form.Item label="Telefone">
              <InputMask
                mask="(99) 99999-9999"
                onChange={e => setData({ ...data, tel: e.target.value })}
                value={data.tel}
              />
            </Form.Item>
          </Form>
        ) : (
          <></>
        )}
      </Modal>
    </Container>
  );
}

export default DrawerCliente;
