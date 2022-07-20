import React, { useState, useEffect } from 'react';

import {
  Container,
  Header,
  ContainerSaldo,
  Title,
  SubTitle,
  ContainerInput
} from './styles';

import { convertMoney } from '~/modules/Util'
import InputCurrency from '~/utils/Currency'

function Laboratorio(props) {

  return (
    <Container>
      <Header>
        <ContainerSaldo>
          <Title>Laboratório</Title>
          <SubTitle>{convertMoney(props.restante)}</SubTitle>
        </ContainerSaldo>
        <ContainerSaldo>
          <Title>Retido</Title>
          <SubTitle>{convertMoney(props.retido)}</SubTitle>
        </ContainerSaldo>
      </Header>
      <ContainerInput>
        <Title>
          {props.title}
        </Title>
        <InputCurrency
          defaultValue={props.defaultValue}
          max={props.restante}
          onChange={e => {
            props.onChange(e)
          }}
        />
      </ContainerInput>
    </Container>
  )
}

export default Laboratorio;