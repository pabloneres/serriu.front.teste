import React from 'react';

import { Container, Header } from './styles';

import { Card, Button, Dropdown } from 'antd'

import Filter from './components/Filter'
import Cards from './components/Cards'

function Comissoes() {

  const Extra = (props) => {
    return (
      <Dropdown overlay={Filter} trigger={['click']} >
        <span>Filtro</span>
      </Dropdown>
    )
  }



  return (
    <Container>
      <Card
        title="Comissões"
        extra={Extra()}
      >

      </Card>
    </Container>
  )
}

export default Comissoes;