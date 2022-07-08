import React, { useState, useEffect } from "react";

import { Container } from "./styles";
import { Modal, Form, Input, Drawer, Button } from "antd";
import InputMask from "~/utils/mask";
import { store, show, update } from "~/services/controller";
import { useSelector, useDispatch } from "react-redux";

function DrawerCliente() {
  const dispatch = useDispatch()
  const { editCliente } = useSelector(state => state.agenda);
  const { token } = useSelector(state => state.auth);
  const { selectedClinic } = useSelector(state => state.clinic);
  const [data, setData] = useState({});
  const [initial, setInitial] = useState();

  useEffect(() => {
    if (editCliente) {
      show("patient", editCliente).then(({ data }) => {
        setInitial({
          firstName: data.firstName,
          lastName: data.lastName,
          tel: data.tel
        });
        setData(data);
      });
    }
  }, [editCliente]);

  const handleSend = e => {
    update("patient", editCliente, e).then(() => {
      setData({});
      handleClose()
    });
  };

  useEffect(() => {
    setData(editCliente);
  }, [editCliente]);

  const handleClose = () => {
    dispatch({
      type: 'RELOAD'
    })
    dispatch({
      type: "EDIT_CLIENT",
      payload: undefined
    })
  }

  return (
    <Drawer
      destroyOnClose={true}
      title="Editar cliente"
      width={400}
      visible={editCliente ? true : false}
      onClose={handleClose}
    >
      {initial ? (
        <Form layout="vertical" onFinish={handleSend} initialValues={initial}>
          <Form.Item
            rules={[{ required: true, message: "Campo obrigatório" }]}
            label="Nome"
            name="firstName"
          >
            <Input
              placeholder="Nome"
            // onChange={e => setData({ ...data, firstName: e.target.value })}
            // value={data.firstName}
            />
          </Form.Item>
          <Form.Item
            rules={[{ required: true, message: "Campo obrigatório" }]}
            label="Sobrenome"
            name="lastName"
          >
            <Input
              placeholder="Sobrenome"
            // onChange={e => setData({ ...data, lastName: e.target.value })}
            // value={data.lastName}
            />
          </Form.Item>
          <Form.Item
            rules={[
              {
                required: true,
                max: 15,
                min: 15,
                message: "Campo obrigatório"
              }
            ]}
            label="Telefone"
            name="tel"
          >
            <InputMask
              mask="(99) 99999-9999"
              maskPlaceholder={null}
            // onChange={e => setData({ ...data, tel: e.target.value })}
            // value={data.tel}
            />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            Salvar
          </Button>
        </Form>
      ) : (
        <></>
      )}
    </Drawer>
  );
}

export default DrawerCliente;
