import React, { useState, useEffect } from "react";
import { Form, Input, Select, Button } from 'antd'
import InputCurrency from "~/utils/Currency";
import InputMask from "~/utils/mask";
import { Notify } from "~/modules/global";
import { useSelector } from "react-redux";
import axios from 'axios'
import { FormRow } from "~/modules/global";

import { show, update, store } from '~/services/controller'


function EditarClinicaPage({ history }) {
  const [clinic, setClinic] = useState()
  const [reload, setRelaod] = useState(false)

  const [ufs, setUfs] = useState([])

  useEffect(() => {
    axios.get('https://servicodados.ibge.gov.br/api/v1/localidades/estados').then(({ data }) => {
      setUfs(data)
    }).catch(() => {
      return
    })
  }, [])

  const handleSend = (data) => {
    store('clinic', data).then(_ => {
      setRelaod(!reload)
      Notify('success', 'Clinica criada')
      return history.push('/clinicas')
    })
  }

  return (
    <Card>
      <CardHeader title="Adicionar nova cliníca"></CardHeader>
      <CardBody>
        <Form layout="vertical" onFinish={handleSend}>
          <FormRow columns={3}>
            <Form.Item label="Nome" name="name">
              <Input placeholder="Nome da clinica" />
            </Form.Item>
            <Form.Item label="Razão Social" name="name_fantasy">
              <Input placeholder="Razão cocial da clinica" />
            </Form.Item>
            <Form.Item label="Telefone" name="tel">
              <InputMask mask="(99) 99999-9999" placeholder="Telefone da clinica" />
            </Form.Item>
          </FormRow>

          <FormRow columns={3}>
            <Form.Item label="CNPJ" name="register">
              <InputMask mask="99.999.999/9999-99" placeholder="Cnpj da clinica" />
            </Form.Item>

            <Form.Item label="Email" name="email">
              <Input placeholder="clinica@email.com.br" />
            </Form.Item>

            <Form.Item label="Endereço" name="address">
              <Input placeholder="Endereço da clinica" />
            </Form.Item>
          </FormRow>

          <FormRow columns={3}>
            <Form.Item label="Cidade" name="city">
              <Input placeholder="Cidade da clinica" />
            </Form.Item>

            <Form.Item label="UF" name="uf">
              <Select
                placeholder="AC"
                options={ufs.map(item => ({
                  label: item.sigla,
                  value: item.sigla
                }))}
              />
            </Form.Item>
          </FormRow>

          <div className="separate"></div>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <Button>Cancelar</Button>
            <Button type="primary" style={{ marginLeft: 5 }} htmlType="submit">Salvar</Button>
          </div>
        </Form>
      </CardBody>
    </Card>
  );
}

export default EditarClinicaPage