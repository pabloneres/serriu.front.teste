import React, { useEffect, useState } from 'react';

import { Container } from './styles';
import { useSelector } from 'react-redux'
import { Card, Table, Space, Button, Skeleton } from 'antd'
import { index } from '~/controllers/controller'
import { convertMoney } from '~/modules/Util'

function Receber() {
  const { token } = useSelector(state => state.auth)
  const { selectedClinic } = useSelector(state => state.clinic)
  const [comissoes, setComissoes] = useState([])
  const [loading, setLoading] = useState(true)
  const [reload, setReload] = useState(true)

  const columns = [
    {
      title: 'Data de execução',
      dataIndex: 'created_at'
    },
    {
      title: 'Profissional',
      dataIndex: 'dentista_id'
    },
    {
      title: 'Procedimento',
      dataIndex: 'procedimento_id'
    },
    {
      title: 'Paciente',
      dataIndex: 'paciente_id'
    },
    {
      title: 'Total ',
      dataIndex: 'total',
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: 'Laboratório',
      dataIndex: 'lab',
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: 'Comissão',
      dataIndex: 'comissao',
      render: data => <span>{convertMoney(data)}</span>
    },
    {
      title: 'Ações',
      render: () => (
        <Space>
          <Button disabled type="primary">Pagar</Button>
        </Space>
      )
    }
  ]

  if (loading) {
    return (
      <Card>
        <Skeleton active={true} />
      </Card>
    )
  }

  return (
    <Card title="Comissões">
      <Table
        columns={columns}
        dataSource={comissoes}
      />
    </Card>
  )
}

export default Receber;