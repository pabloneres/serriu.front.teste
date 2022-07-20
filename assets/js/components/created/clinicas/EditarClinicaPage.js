import React, { useState, useEffect } from "react";
import { Card, CardHeader, CardBody } from "~/_metronic/_partials/controls";
import { Form, Input, Select, Button } from 'antd'
import InputCurrency from "~/utils/Currency";
import InputMask from "~/utils/mask";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Notify } from "~/modules/global";
import { useSelector } from "react-redux";
import axios from 'axios'
import { FormRow } from "~/modules/global";

import { show, update } from '~/services/controller'


function EditarClinicaPage({ history }) {
  const { params, url } = useRouteMatch()
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

  useEffect(() => {
    show('clinic', params.id)
      .then(({ data }) => {
        setClinic(data)
      })
      .catch((err) => history.push('/clinicas'))
  }, [])

  const handleSend = (data) => {
    update('clinic', clinic.id, data).then(_ => {
      setRelaod(!reload)
      return Notify('success', 'Dados da clinica atualizados')
    })
  }

  return (
    <Card>
      <CardHeader title="Editar clínica"></CardHeader>
      <CardBody>
        {
          clinic ?
            <Form layout="vertical" initialValues={clinic} onFinish={handleSend}>
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
                <Button onClick={() => history.push("/clinicas")}>Cancelar</Button>
                <Button type="primary" style={{ marginLeft: 5 }} htmlType="submit">Salvar</Button>
              </div>
            </Form> : <></>
        }
        {/* <Form
          onSubmit={formik.handleSubmit}
        >
        {formik.status && (
          <div className="mb-10 alert alert-custom alert-light-danger alert-dismissible">
            <div className="alert-text font-weight-bold">{formik.status}</div>
          </div>
        )}
          <Form.Row>
            <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Nome *</Form.Label>
              <Form.Control 
                placeholder="Digite seu nome"
                type="text"
                name="name"
                {...formik.getFieldProps("name")}
                />
              {formik.touched.name && formik.errors.name ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.name}</div>
              </div>
              ) : null}
            </Form.Group>

            <Form.Group as={Col} controlId="formGridPassword">
              <Form.Label>Razão social *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite a Razão social da sua empresa"
                name="name_fantasy"
                {...formik.getFieldProps("name_fantasy")}
              />
              {formik.touched.name_fantasy && formik.errors.name_fantasy ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.name_fantasy}</div>
              </div>
              ) : null}
            </Form.Group>
          </Form.Row>

          <Form.Row >

          <Form.Group  as={Col} controlId="formGridAddress2">
            <Form.Label>Telefone *</Form.Label>
            <Form.Control
             placeholder="Digite o telefone da clínica"
             name="tel"
             {...formik.getFieldProps("tel")}
             />
              {formik.touched.tel && formik.errors.tel ? (
                <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.tel}</div>
              </div>
              ) : null}
          </Form.Group>

          <Form.Group as={Col}>
              <Form.Label>CPF/CPNJ  *</Form.Label>
              <Form.Control
              placeholder="Digite o CPF ou register"
              type="text"
              name="register"
              {...formik.getFieldProps("register")}
              />
              {formik.touched.register && formik.errors.register ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.register}</div>
              </div>
              ) : null}
            </Form.Group>
          
          </Form.Row>

          <Form.Row>
              
          <Form.Group as={Col} controlId="formGridEmail">
              <Form.Label>Email *</Form.Label>
              <Form.Control
                placeholder="Digite um email"
                type="email"
                name="email"
                {...formik.getFieldProps("email")}
              />
              {formik.touched.email && formik.errors.email ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.email}</div>
                </div>
              ) : null}
            </Form.Group>

          </Form.Row>

          <Form.Row>
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Endereço  *</Form.Label>
              <Form.Control
                placeholder="Digite o endereço da clínica"
                 name="address"
                 {...formik.getFieldProps("address")}
              />
              {formik.touched.address && formik.errors.address ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.address}</div>
              </div>
              ) : null}
            </Form.Group>
            
            <Form.Group as={Col} controlId="formGridCity">
              <Form.Label>Cidade  *</Form.Label>
              <Form.Control
                placeholder="Digite o cidade"
                 name="city"
                 {...formik.getFieldProps("city")}
              />
              {formik.touched.city && formik.errors.city ? (
              <div className="fv-plugins-message-container">
                <div className="fv-help-block">{formik.errors.city}</div>
              </div>
              ) : null}
            </Form.Group>

            <Form.Group controlId="formGridAddress1">
              <Form.Label>UF *</Form.Label>
              <Form.Control
                as="select"
                name="uf"
                {...formik.getFieldProps("uf")}
              >
                <option value="" ></option>
                {
                  ufs.map((uf) => {
                  return (
                  <option value={uf.sigla} >{uf.sigla}</option>
                  )
                  })
                }
              </Form.Control>
              {formik.touched.uf && formik.errors.uf ? (
                <div className="fv-plugins-message-container">
                  <div className="fv-help-block">{formik.errors.uf}</div>
                </div>
              ) : null}
            </Form.Group>

       
          </Form.Row>

          <div className="text-right">
            <Link to="/clinicas">
              <Button className="mr-2" variant="danger">
                Cancelar
              </Button>
            </Link>
            <Button variant="primary" type="submit">
              Salvar
            </Button>
          </div>
        </Form> */}
      </CardBody>
    </Card>
  );
}

export default EditarClinicaPage