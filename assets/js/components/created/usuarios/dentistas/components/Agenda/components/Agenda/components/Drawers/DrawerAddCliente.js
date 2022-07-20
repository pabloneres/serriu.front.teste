import React, { useState, useEffect } from 'react';

import { Container } from './styles';
import { Modal, Form, Input } from 'antd'
import InputMask from '~/utils/mask'
import { store } from '~/controllers/controller'
import { useSelector } from "react-redux";

function DrawerCliente({ addCliente, setAddCliente, setUpdateClientes, updateClientes }) {
  const { token } = useSelector((state) => state.auth);
  const { selectedClinic } = useSelector((state) => state.clinic);
  const [data, setData] = useState({})

  const handleSend = () => {
    store(token, 'patient', { ...data, clinic_id: selectedClinic.id }).then(() => {
      setData({})
      setAddCliente(undefined)
      setUpdateClientes(!updateClientes)
    })
  }

  useEffect(() => {
    setData({...data, firstName: addCliente})
  }, [addCliente])

  return (
    <Container>
      <Modal visible={addCliente}
        onOk={() => handleSend()}
        onCancel={() => setAddCliente(undefined)}
      >
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
      </Modal>
    </Container>
  )
}

export default DrawerCliente;