import React from 'react';

import {
  Background,
  Container,
  Header,
  Title,
  Close
} from './styles';

import { CloseOutlined } from '@ant-design/icons'

function Modal(props) {
  console.log(props)
  return (
    props.visible ?
      <Container>
        {/* <Header>
          <Title>{props.title}</Title>
          <Close>
            <CloseOutlined onClick={() => props.onClose()} />
          </Close>
        </Header> */}
        {props.children}
      </Container > : <></>

  )
}

export default Modal;
{/* <Header>
    <Title>{props.title}</Title>
    <Close>
      <CloseOutlined onClick={() => props.onClose()} />
    </Close>
  </Header> */}