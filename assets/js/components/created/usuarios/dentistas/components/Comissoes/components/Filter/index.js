import React from 'react';

import { Container } from './styles';

import { Form, Input, DatePicker, Select, Card } from 'antd'

const { RangePicker } = DatePicker

function filter() {
  return (
    <Card>
      <Container>
        <Form layout="vertical">
          <Form.Item
            label="Status"
          >
            <Select
              options={[
                {
                  label: 'Pendentes',
                  value: 'pendente',
                },
                {
                  label: 'A Receber',
                  value: 'receber',
                },
                {
                  label: 'Pago',
                  value: 'pago',
                },
              ]}
            />
          </Form.Item>
          <Form.Item
            label="Período"
          >
            <RangePicker />
          </Form.Item>
        </Form>
      </Container>
    </Card>
  )
}

export default filter;