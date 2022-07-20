import React, { useState } from 'react';

import { Row, Container, Header, Extra } from './styles';
import { Table, Card, Button, Modal, Input, Form, Tabs, DatePicker, Select, Radio } from 'antd'
import InputCurrency from '~/utils/Currency'

const { TabPane } = Tabs
const { TextArea } = Input
function Principal() {
  const [showModal, setShowModal] = useState(false)
  const [name, setName] = useState()
  const [mode, setMode] = useState('todos')

  const columns = [
    {
      title: 'Data',
    },
    {
      title: 'Usuário',
    },
    {
      title: 'Descrição',
    },
    {
      title: 'Forma Pagamento',
    },
    {
      title: 'Valor',
    },
    {
      title: 'Saldo',
    },
  ]

  return (
    <Card
      title={
        <Row>
          <Radio.Group onChange={e => setMode(e.target.value)} value={mode}>
            <Radio.Button value="todos">Todos</Radio.Button>
            <Radio.Button value="entrada">Entrada</Radio.Button>
            <Radio.Button value="saida">Saída</Radio.Button>
          </Radio.Group>
          <Extra>
            <Select
              placeholder="Filtrar caixas"
              style={{ width: 180, marginRight: 10 }}
              options={[
                {
                  label: 'Todos',
                  value: 'todos'
                },
                {
                  label: 'Caixa - Pablo',
                  value: 'pablo'
                },
              ]}
            />
            <DatePicker
              placeholder="Filtrar data"
              style={{ width: 180 }}
            />
          </Extra>
        </Row>
      }
      extra={
        <Button type="primary"
          onClick={() => setShowModal(true)}
        >Adicionar</Button>
      }
    >
      <Modal
        visible={showModal}
        onCancel={() => setShowModal(false)}
      >
        <Form layout="vertical">
          <Form.Item label="Tipo">
            <Select
              options={[
                {
                  label: 'Entrada',
                  value: 'entrada'
                },
                {
                  label: 'Saída',
                  value: 'saida'
                },
              ]}
            />
          </Form.Item>
          <Form.Item label="Valor">
            <InputCurrency
              onChange={() => { }}
            />
          </Form.Item>
          <Form.Item label="Descrição">
            <TextArea />
          </Form.Item>
        </Form>
      </Modal>
      <Table
        rowSelection
        columns={columns}
      />
      {/* <Card title="Resumo">
        
      </Card> */}
    </Card>
  )
}

export default Principal;