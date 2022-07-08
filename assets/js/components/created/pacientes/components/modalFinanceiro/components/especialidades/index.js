import React, { useState, useEffect } from 'react';

import { Container, ContainerInput, Title } from './styles';
import { Input, Tooltip } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'
import { convertMoney } from '~/modules/Util'
import InputCurrency from '~/utils/Currency'

function Especialidades({ defaultValue, onChange, title, restante }) {
  return (
    <Container>
      <Title>
        <span>{title}</span>
        <span>| {convertMoney(Number(restante))}</span>
      </Title>
      <ContainerInput>
        <InputCurrency
          max={Number(restante)}
          onChange={(e) => onChange(e)}
        />
      </ContainerInput>
    </Container>
  )
}

export default Especialidades;